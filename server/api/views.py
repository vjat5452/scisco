import requests
import datetime
import json
from bs4 import BeautifulSoup
from requests_html import HTMLSession

from rest_framework.generics import ListAPIView
from rest_framework.response import Response

class PlatformView(ListAPIView):

    def get(self, request, *args, **kwargs):
        self.__platform = kwargs.get('platform')
        self.__username = kwargs.get('username')

        if self.__platform == "codeforces":
            return self.__codeforces()
        elif self.__platform == "codechef":
            return self.__codechef()
        elif self.__platform == "leetcode":
            return self.__leetcode()
        elif self.__platform == "atcoder":
            return self.__atcoder()
        else:
            return Response({"status": 404, "message" : "Platform not found"})
        
    def __codeforces(self):
        api_urls = {
            "user_info": {"url": f'https://codeforces.com/api/user.info?handles={self.__username}'},
            "user_submissions" : {"url": f'https://codeforces.com/api/user.status?handle={self.__username}&from=1&count=10'},
        }

        response = requests.get(api_urls["user_info"]["url"])
        if(response.status_code != 200):
            return Response({"status": 404, "message" : "User not found"})
            
        user_data = response.json()

        if(user_data["status"] != "OK"):
            return Response({"status": 404, "message" : "User not found"})

        #Formatting the data to be sent to the frontend
        data = {}
        data["status"] = 200    
        data["handle"] = user_data["result"][0]["handle"]

        try:
            data["name"] = user_data["result"][0]["firstName"] + " " + user_data["result"][0]["lastName"]
        except:
            data["name"] = ""

        data["rating"] = user_data["result"][0]["rating"]
        data["maxRating"] = user_data["result"][0]["maxRating"]
        data["rank"] = user_data["result"][0]["rank"]
        data["maxRank"] = user_data["result"][0]["maxRank"]
        data["titlePhoto"] = user_data["result"][0]["titlePhoto"]
        data["submissions"] = []
        
        response = requests.get(api_urls["user_submissions"]["url"])
        if(response.status_code == 200):
            submission_data = response.json()
            if(submission_data["status"] == "OK"):
                for problem in submission_data["result"]:
                    data["submissions"].append({
                        "submissionUrl" : f"https://codeforces.com/contest/{problem['contestId']}/submission/{problem['id']}",
                        "submissionTime": datetime.datetime.fromtimestamp(problem["creationTimeSeconds"]).strftime('%Y-%m-%d %H:%M:%S'),
                        "problemName": problem["problem"]["name"],
                        "problemLink": f"https://codeforces.com/problemset/problem/{problem['problem']['contestId']}/{problem['problem']['index']}",
                        "verdict": "AC "if problem["verdict"] == "OK" else "WA",
                        "problemTags": problem["problem"]["tags"]
                    })  

        return Response(data)

    def __codechef(self):
        data = dict()

        url = f"https://www.codechef.com/users/{self.__username}"
        session = HTMLSession()

        # 5 seconds to wait for the server to response
        r = session.get(url,timeout=5)
        if(r.status_code != 200):
            return Response({"message" : "Some error occured."})

        name = r.html.find('.h2-style', first=True) 
        data['Name'] = name.text
        current_rating = r.html.find('.rating-number', first=True)
        data['Rating'] = current_rating.text

        rating_ranks = r.html.find('.rating-ranks', first=True)

        for detail in rating_ranks.find('li'):
            data[detail.text.split(' ')[1] + " " + detail.text.split(' ')[2]] = detail.text.split(' ')[0]

        highest_rating = r.html.find('small', containing='Highest Rating', first=True)
        data['Highest Rating'] = highest_rating.text[-5:-1]        

        excluded = ["Institution:", "Student/Professional:","CodeChef Pro Plan:","Link:","Teams List:"]
        user_details = r.html.find('.user-details', first=True) 
        for detail in user_details.find('li'):
            label = detail.find('label', first=True).text
            if(label not in excluded):
                data[label] = detail.find('span', first=True).text

        # Get Submissions
        url = f"https://www.codechef.com/recent/user?page=undefined&user_handle={self.__username}&_=1674396373464"
        headers = {
            'accept' : 'application/json, text/javascript, */*; q=0.01',
            'cookie' : 'SESS93b6022d778ee317bf48f7dbffe03173=d192a7f692d6bcfb9ac1c1c44e432cbd',
            'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
        }
        

        page = session.get(url=url,headers=headers,timeout=5)
        r = page.json()['content']
        soup = BeautifulSoup(r,'html.parser')

        submission = []
        for row in soup.find_all('tr'):
            cols = row.find_all('td')
            link = row.find_all('a')

            if len(cols) == 0 or len(link) != 2:
                continue

            cols = [ele.text.strip() for ele in cols]
            cols = [ele for ele in cols if ele]
            cols.pop()
            cols.append(link[0]['href'])
            cols.append(link[1]['href'])
            submission.append(cols)   

        submission = [ele for ele in submission if ele]

        data["submissions"] = []

        for i in range(len(submission)):
            if len(submission[i]) == 6:
                data["submissions"].append({
                    "submissionTime" : submission[i][0],
                    "problemName" : submission[i][1],
                    "problemLink" : f"https://www.codechef.com{submission[i][4]}",
                    "submissionUrl" : f"https://www.codechef.com{submission[i][5]}",
                    "verdict" : "AC" if (submission[i][2] == '(100)') else "WA"
                })
            elif len(submission[i]  ) == 5:
                data["submissions"].append({
                    "submissionUrl" : f"https://www.codechef.com{submission[i][4]}",
                    "problemName" : submission[i][1],
                    "problemLink" : f"https://www.codechef.com{submission[i][3]}",
                    "submissionTime" : submission[i][0],
                    "verdict" : "WA"
                })

        # print(data)
        return Response(data)


    def __leetcode(self):
        url = f'https://leetcode.com/{self.__username}'
        
        if requests.get(url).status_code != 200:
            return Response({"status": 404, "message" : "User not found"})

        payload = {
            "operationName": "getUserProfile",
            "variables": {
                "username": self.__username
            },
            "query": "query getUserProfile($username: String!) {  allQuestionsCount {    difficulty    count  }  matchedUser(username: $username) {    contributions {    points      questionCount      testcaseCount    }    profile {    reputation      ranking    }    submitStats {      acSubmissionNum {        difficulty        count        submissions      }      totalSubmissionNum {        difficulty        count        submissions      }    }  }}"
        }

        res = requests.post(url='https://leetcode.com/graphql',
                            json=payload,
                            headers={'referer': f'https://leetcode.com/{self.__username}/'})
        
        try:
            res.raise_for_status()

            if(res.status_code != 200):
                return Response({"status": 500, "message" : "Some error occured"})
                                
            res = res.json()
            res = json.loads(json.dumps(res))

            print(res)

            data = dict()
            data["username"] = self.__username
            data["Reputation"] = res['data']['matchedUser']['profile']['reputation']
            data["Ranking"] = res['data']['matchedUser']['profile']['ranking']
            data["Accepted Submissions"] = res['data']['matchedUser']['submitStats']['acSubmissionNum'][0]['submissions']
            data["Total Submissions"] = res['data']['matchedUser']['submitStats']['totalSubmissionNum'][0]['submissions']
            data["Accuracy"] = round((data['Accepted Submissions']/data['Total Submissions'])*100,2)
        
            return Response(data)

        except:
            return Response({"status": 500, "message" : "Too Many Requests"})

    def __atcoder(self):
        pass
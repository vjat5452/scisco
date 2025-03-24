from rest_framework.response import Response
from rest_framework import status 
from rest_framework.views import APIView
from rest_framework.authentication import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, UserProfilesSerializer
from .models import NewUser, UserProfiles

class ListCreateUserView(APIView):
    permission_classes = [AllowAny]
    queryset = NewUser.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        user_name = request.GET.get('user_name')
        if user_name:
            try:
                user = self.queryset.get(user_name=user_name)
                serializer = self.serializer_class(user)
                try:    
                    profiles = UserProfiles.objects.get(user=user)
                    if profiles:
                        profile_serializer = UserProfilesSerializer(profiles)
                        return Response({"user": serializer.data, "profiles": profile_serializer.data}, status=status.HTTP_200_OK)
                    return Response({"user": serializer.data, "profiles" : None}, status=status.HTTP_200_OK)
                except:
                    return Response({"user": serializer.data, "profiles" : None}, status=status.HTTP_200_OK)
            except:
                return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_400_BAD_REQUEST)   

    def post(self, request):        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                user = authenticate(username=user.user_name, password=request.data["password"])
                if user:
                    refresh = RefreshToken.for_user(user)
                    res = {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                    return Response(res, status=status.HTTP_201_CREATED)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = UserSerializer
    
    def put(self, request):
        serializer = self.serializer_class(request.user, data=request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self,request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message":"Successful Logout"}, status=status.HTTP_200_OK)
        except :
            return Response({"message":"Invalid Request"}, status=status.HTTP_400_BAD_REQUEST)
        
class UserProfilesView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = UserProfilesSerializer

    def get(self, request):
        try:
            profiles = UserProfiles.objects.get(user=request.user)
            serializer = self.serializer_class(profiles)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        try:
            profiles = UserProfiles.objects.get(user=request.user)
            serializer = self.serializer_class(profiles, data=request.data, partial = True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class AddFriendView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = UserSerializer
    queryset = NewUser.objects.all()

    def post(self, request):
        try:
            friend = self.queryset.get(user_name=request.data["user_name"])
            if friend:
                request.user.friends.add(friend)
                return Response({"message":"Friend Added Successfully"},status=status.HTTP_200_OK)
            return Response({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"message":"User Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
class RemoveFriendView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = UserSerializer
    queryset = NewUser.objects.all()

    def post(self, request):
        try:
            friend = self.queryset.get(user_name=request.data["user_name"])
            if friend:
                request.user.friends.remove(friend)
                return Response({"message":"Friend Removed Successfully"}, status=status.HTTP_200_OK)
            return Response({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)
        
class ListFriendsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = UserSerializer

    def get(self, request):
        try:
            friends = request.user.friends.all()
            serializer = self.serializer_class(friends, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
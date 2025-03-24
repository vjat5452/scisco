from rest_framework import serializers
from users.models import NewUser, UserProfiles

class UserSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(max_length=50, required=True, write_only = True)
    user_name = serializers.CharField(max_length=50, required=True)
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = NewUser
        fields = ['user_name', 'email', 'first_name', 'password', 'last_name', 'bio', 'profile_pic']
        extra_kwargs = {'email':{'write_only' : True},'password': {'write_only': True}}

    def validate(self, args):
        email = args.get('email', None)
        user_name = args.get('user_name', None)
        if email and NewUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': ('Email is already in use')})
        
        if user_name and NewUser.objects.filter(user_name=user_name).exists():
            raise serializers.ValidationError({'user_name': ('Username is already in use')})
        
        return super().validate(args)

    def create(self, validated_data):
        return NewUser.objects.create_user(**validated_data)    
    
class UserProfilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfiles
        fields = ['codeforces', 'codechef', 'leetcode', 'atcoder', 'github', 'linkedin', 'website']

    def create(self, validated_data):
        return UserProfiles.objects.create(**validated_data)
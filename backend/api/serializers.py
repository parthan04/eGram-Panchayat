from email import _header_value_parser
from email import _header_value_parser
from email import _header_value_parser
from email import _header_value_parser
from email import _header_value_parser
import re
from django.contrib.auth.password_validation import validate_password

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

# pyrefly: ignore [missing-import]
from .models import User,Services,ServiceApplication,News,Birthcertificate,Deathcertificate,Marriagecertificate,Castecertificate,Incomecertificate,Taxes,ClientPayment

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,  required=True)
    class Meta:
        model = User
        fields = ['id','username', 'last_name' ,'email', 'phone','address','district','dob','id_proof','password','status','staff_status','staff_designation','role','created_at']
        
        extra_kwargs = {
                    "password": {"write_only": True}
                }
    
    def validate_password(self,value):
        validate_password(value)
        return value
    
    def validate_email(self, value):
        queryset = User.objects.filter(email__iexact=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError("Email is already in use.")

        return value
        
    def validate_phone(self,value):
    
        if not re.fullmatch(r'^\d{10}$', value):
            raise serializers.ValidationError("Phone number must be 10 digits.")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)



class StaffRegisterationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,  required=True)
    class Meta:
        model = User
        fields = ['id','username', 'last_name' ,'email', 'phone','address','district','dob','id_proof','password','staff_status','staff_designation','role','created_at']
        
        extra_kwargs = {
                    "password": {"write_only": True}
                }
    
    def validate_password(self,value):
        validate_password(value)
        return value
    
    def validate_email(self, value):
        queryset = User.objects.filter(email__iexact=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError("Email is already in use.")

        return value
        
    def validate_phone(self,value):
    
        if not re.fullmatch(r'^\d{10}$', value):
            raise serializers.ValidationError("Phone number must be 10 digits.")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)

class LoginSerializer(TokenObtainPairSerializer):
    
    def validate(self,attrs):
        data = super().validate(attrs)
        
        user = self.user
        
        data["user"] = {
            "id":self.user.id,
            "username": self.user.username,
            "last_name":self.user.last_name,
            "email": self.user.email,
            "phone": self.user.phone,
            "address": self.user.address,
            "district": self.user.district,
            "dob": self.user.dob,
            "id_proof": self.user.id_proof,
            "date_joined":self.user.date_joined,
            "role": self.user.role,
            "staff_designation":self.user.staff_designation
        }

        return data

class StaffLoginSerializer(LoginSerializer):
    
    def validate(self,attrs):
        data = super().validate(attrs)
        
        user = self.user
        
        data["user"] = {
            "id":self.user.id,
            "username": self.user.username,
            "last_name":self.user.last_name,
            "email": self.user.email,
            "phone": self.user.phone,
            "address": self.user.address,
            "district": self.user.district,
            "dob": self.user.dob,
            "id_proof": self.user.id_proof,
            "date_joined":self.user.date_joined,
            "role": self.user.role,
            "staff_designation":self.user.staff_designation,
            "staff_status":self.user.staff_status,
        }
        
        if self.user.role != 'staff':
            raise serializers.ValidationError({'detail': 'This is not a staff account.'})
        return data

class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = '__all__'


class ServiceApplicationSerializer(serializers.ModelSerializer):

    service = serializers.CharField(source='service.title',read_only=True)
    citizen = serializers.CharField(source='citizen.username',read_only=True)
    attachment_url = serializers.SerializerMethodField()

    class Meta:
        model = ServiceApplication
        fields = ["id", "citizen", "service", "description", "location", "attachment", "attachment_url", "status", "remarks", "created_at", "updated_at"]
        read_only_fields = ["citizen",'service','created_at', 'updated_at']

    def get_attachment_url(self, obj):
        if obj.attachment:
            return obj.attachment.url
        return None

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'

class BirthCertificateSerializer(serializers.ModelSerializer):

    citizen = serializers.CharField(source='citizen.username',read_only=True)
    id_proof_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Birthcertificate
        fields = ['id','citizen','fname','lname','dob','id_proof','id_proof_url','b_date','b_place','b_weight','b_time','gender','phone','email','father_name','mother_name','remarks','created_at','status']
        read_only_fields = ['citizen','id_proof_url','created_at','status']

    def get_id_proof_url(self, obj):
        if obj.id_proof:
            return obj.id_proof.url
        return None

class DeathCertificateSerializer(serializers.ModelSerializer):

    citizen = serializers.CharField(source='citizen.username',read_only=True)
    d_proof_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Deathcertificate
        fields = ['id','citizen','d_name','d_place','d_date','d_time','d_proof','d_proof_url','cause_d','gender','phone','email','remarks','created_at','status']
        read_only_fields = ['citizen','d_proof_url','created_at','status']

    def get_d_proof_url(self, obj):
        if obj.d_proof:
            return obj.d_proof.url
        return None
        
class MarriageCertificateSerializer(serializers.ModelSerializer):

    citizen = serializers.CharField(source='citizen.username',read_only=True)
    m_husband_id_proof_url = serializers.SerializerMethodField()
    m_wife_id_proof_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Marriagecertificate
        fields = ['id','citizen','h_name','w_name','date_of_marriage','address','place_of_marriage','marriage_reg_no','m_husband_id_proof','m_husband_id_proof_url','m_wife_id_proof','m_wife_id_proof_url','phone','email','remarks','created_at','status']
        read_only_fields = ['citizen','m_husband_id_proof_url','m_wife_id_proof_url','created_at','status']

    def get_m_husband_id_proof_url(self, obj):
        if obj.m_husband_id_proof:
            return obj.m_husband_id_proof.url
        return None

    def get_m_wife_id_proof_url(self, obj):
        if obj.m_wife_id_proof:
            return obj.m_wife_id_proof.url
        return None

class CasteCertificateSerializer(serializers.ModelSerializer):

    citizen = serializers.CharField(source='citizen.username',read_only=True)
    sslc_certificate_url = serializers.SerializerMethodField()
    id_proof_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Castecertificate
        fields = ['id','citizen','caste','email','phone','gender','address','dob','parent_name','religion','ration_card_no','sslc_certificate','sslc_certificate_url','id_proof','id_proof_url','remarks','created_at','status']
        read_only_fields = ['citizen','sslc_certificate_url','id_proof_url','created_at','status']

    def get_sslc_certificate_url(self, obj):
        if obj.sslc_certificate:
            return obj.sslc_certificate.url
        return None

    def get_id_proof_url(self, obj):
        if obj.id_proof:
            return obj.id_proof.url
        return None

class IncomeCertificateSerializer(serializers.ModelSerializer):

    citizen = serializers.CharField(source='citizen.username',read_only=True)
    inc_src_url = serializers.SerializerMethodField()
    id_proof_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Incomecertificate
        fields = ['id','citizen','email','phone','gender','address','dob','parent_name','occupation','ration_card_no','income','inc_src','inc_src_url','id_proof','id_proof_url','remarks','created_at','status']
        read_only_fields = ['citizen','inc_src_url','id_proof_url','created_at','status']

    def get_inc_src_url(self, obj):
        if obj.inc_src:
            return obj.inc_src.url
        return None

    def get_id_proof_url(self, obj):
        if obj.id_proof:
            return obj.id_proof.url
        return None

class AdminLoginSerializer(LoginSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not (self.user.is_superuser and self.user.role == 'admin'):
            raise serializers.ValidationError({'detail': 'This is not an admin account.'})
        return data

class TaxesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Taxes
        fields = '__all__'

class ClientPaymentSerializer(serializers.ModelSerializer):
    tax_name = serializers.CharField(source='tax.tax_name', read_only=True)
    citizen_name = serializers.CharField(source='citizen.username', read_only=True)

    class Meta:
        model = ClientPayment
        fields = ['id', 'citizen_name', 'tax', 'tax_name', 'amount',
                  'gateway_order_id', 'gateway_payment_id',
                  'status', 'remarks', 'created_at']
        read_only_fields = fields
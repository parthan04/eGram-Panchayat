import uuid
import hashlib

from decimal import Decimal,InvalidOperation

from django.shortcuts import get_object_or_404
from django.conf import settings
from django.http import HttpResponseRedirect
from django.db.models import Q
from django.utils import timezone

# pyrefly: ignore [missing-import]
from .models import User,Services, ServiceApplication, News, Birthcertificate, Deathcertificate, Marriagecertificate, Castecertificate, Incomecertificate, Taxes, ClientPayment
 
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny,IsAuthenticated,BasePermission
from rest_framework.response import Response
from rest_framework import status  
from rest_framework.pagination import PageNumberPagination 

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views  import TokenObtainPairView

# pyrefly: ignore [missing-import]
from .serializers import StaffRegisterationSerializer,StaffLoginSerializer,AdminLoginSerializer,StaffLoginSerializer,RegisterSerializer,LoginSerializer,ServicesSerializer,ServiceApplicationSerializer,NewsSerializer,BirthCertificateSerializer,DeathCertificateSerializer,MarriageCertificateSerializer,CasteCertificateSerializer,IncomeCertificateSerializer,TaxesSerializer,ClientPaymentSerializer
# pyrefly: ignore[missing-import]
from .rag_service import answer_question

def sha512(text):
    return hashlib.sha512(text.encode('utf-8')).hexdigest()

# USER LOGIN
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user=serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "status":"Success",
            "message":'User Register Successfully',
            
            "tokens":{
                "refresh":str(refresh),
                "access":str(refresh.access_token)
            },
            "user":{
                "id":user.id,
                "username":user.username,
                "email":user.email,
                "phone":user.phone,
                "address":user.address,
                "district":user.district,
                "dob":user.dob,
                "id_proof":user.id_proof,
                "date_joined":user.date_joined
            },
        },
          status=status.HTTP_201_CREATED      
        )
    return Response({
        "status":"error",
        "message":serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)



class Login(TokenObtainPairView):
    serializer_class = LoginSerializer

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and u.is_superuser and u.role == 'admin' or u.role == 'staff')


class IsStaffRole(BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and u.role == 'staff')


class AdminLogin(TokenObtainPairView):
    serializer_class = AdminLoginSerializer
    
class StaffLogin(TokenObtainPairView):
    serializer_class = StaffLoginSerializer

def admin_update_status(request, model, serializer_class, id):
    obj = get_object_or_404(model, id=id)

    new_status = request.data.get('status', obj.status)
    valid = [c[0] for c in model._meta.get_field('status').choices]
    if new_status not in valid:
        return Response({'detail': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

    obj.status = new_status
    obj.remarks = str(request.data.get('remarks', obj.remarks))[:1000]
    obj.save()

    return Response(serializer_class(obj, context={'request': request}).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_services(request):
    service = ServicesSerializer(data=request.data)
    if service.is_valid():
        service.save()
        return Response({
            'status':'success',
            'message':'service created successfully'
        },status=status.HTTP_201_CREATED)
    return Response({
        'status':'error',
        'message':service.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_GetService(request):
    service = Services.objects.all()
    serializer = ServicesSerializer(service,many=True)
    return Response({
        "status":"success",
        "message":"services fetched successfully",
        "data":serializer.data
    },status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getService(request,id):
    service = get_object_or_404(Services, id=id)
    serializer = ServicesSerializer(service)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def guest_GetService(request):
    service = Services.objects.all()[:6]
    serializer = ServicesSerializer(service,many=True)
    return Response({
        "status":"success",
        "message":"services fetched successfully",
        "data":serializer.data
    },status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def service_update(request,id):
    service  = get_object_or_404(Services,id=id)
    serializer = ServicesSerializer(service,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def service_delete(request,id):
    service  = get_object_or_404(Services,id=id)
    service.delete()
    return Response({'message':'Service Deleted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_service_application(request, id):

    service = get_object_or_404(
        Services,
        id=id,
    )

    existing_application = ServiceApplication.objects.filter(
        citizen=request.user,
        service=service
    ).order_by('-created_at').first()
    
    if existing_application and existing_application.status != 'Completed' and existing_application.status !='Rejected':
        return Response(
            {
                "detail": "You have already applied for this service."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = ServiceApplicationSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save(
            citizen=request.user,
            service=service
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetMyApplications(request):
    application = ServiceApplication.objects.filter(citizen=request.user).order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(service__title__icontains=search) |
            Q(status__icontains=search) |
            Q(remarks__icontains=search) |
            Q(description__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        application = application.filter(q)
        
    total_records = application.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7

    page = paginator.paginate_queryset(application,request)

    serializer = ServiceApplicationSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def serviceApplication_update(request,id):
    serviceApplications  = get_object_or_404(ServiceApplication,id=id)
    serializer = ServiceApplicationSerializer(serviceApplications,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminRole])
def serviceApplication_update_status(request, id):
    return admin_update_status(request, ServiceApplication, ServiceApplicationSerializer, id)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def serviceApplication_delete(request,id):
    serviceApplications  = get_object_or_404(ServiceApplication,id=id)
    serviceApplications.delete()
    return Response({'message':'Service Application Deleted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_news(request):
    news = NewsSerializer(data=request.data)

    if news.is_valid():
        news.save()
        return Response({
            'status':'success',
            'message':'news created successfully'
        },status=status.HTTP_201_CREATED)
    return Response({
        'status':'error',
        'message':news.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_news(request):
    today = timezone.localdate()
    News.objects.filter(expired_on__lt=today).delete()
    news = News.objects.filter(expired_on__gte=today).order_by('-id')
    serializer = NewsSerializer(news,many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def news_update(request,id):
    newsU  = get_object_or_404(News,id=id)
    serializer = NewsSerializer(newsU,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def news_delete(request,id):
    newsD  = get_object_or_404(News,id=id)
    newsD.delete()
    return Response({'message':'News Deleted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creat_BirthCertificate(request):
    serializer = BirthCertificateSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(citizen=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetMyBirthCertificates(request):
    birthC = Birthcertificate.objects.filter(citizen=request.user).order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        birthC = birthC.filter(q)

    total_records = birthC.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(birthC,request)

    serializer = BirthCertificateSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBirthCertificatePdf(request,id):
    try:
        birthc = Birthcertificate.objects.get(status='Completed',citizen=request.user,id=id)
        serializer = BirthCertificateSerializer(birthc)
        return Response(serializer.data)
    except Birthcertificate.DoesNotExist:
        return Response(
            {'error': 'Completed birth certificate not found.'},
            status=404
        )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def Cbirth_update(request,id):
    cbirth  = get_object_or_404(Birthcertificate,id=id)
    serializer = BirthCertificateSerializer(cbirth,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminRole])
def Cbirth_update_status(request, id):
    return admin_update_status(request, Birthcertificate, BirthCertificateSerializer, id)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def Cbirth_delete(request,id):
    cbirth  = get_object_or_404(Birthcertificate,id=id)
    cbirth.delete()
    return Response({'message':'Birth Certificate Deleted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creat_DeathCertificate(request):
    serializer = DeathCertificateSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(citizen=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetMyDeathCertificates(request):
    deathC = Deathcertificate.objects.filter(citizen=request.user).order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        deathC = deathC.filter(q)

    total_records = deathC.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(deathC,request)
    serializer = DeathCertificateSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDeathCertificatePdf(request,id):
    try:
        deathc = Deathcertificate.objects.get(status='Completed',citizen=request.user,id=id)
        serializer = DeathCertificateSerializer(deathc)
        return Response(serializer.data)
    except Deathcertificate.DoesNotExist:
        return Response(
            {'error': 'Completed Death certificate not found.'},
                status=404
            )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def Cdeath_update(request,id):
    cdeath  = get_object_or_404(Deathcertificate,id=id)
    serializer = DeathCertificateSerializer(cdeath,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminRole])
def Cdeath_update_status(request, id):
    return admin_update_status(request, Deathcertificate, DeathCertificateSerializer, id)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def Cdeath_delete(request,id):
    cdeath  = get_object_or_404(Deathcertificate,id=id)
    cdeath.delete()
    return Response({'message':'Death Certificate Deleted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creat_MarriageCertificate(request):
    serializer = MarriageCertificateSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(citizen=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMarriageCertificatePdf(request,id):
    try:
        marriagec = Marriagecertificate.objects.get(status='Completed',citizen=request.user,id=id)
        serializer = MarriageCertificateSerializer(marriagec)
        return Response(serializer.data)
    except Marriagecertificate.DoesNotExist:
        return Response(
            {'error': 'Completed Marriage certificate not found.'},
                status=404
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetMyMarriageCertificates(request):
    marriageC = Marriagecertificate.objects.filter(citizen=request.user).order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        marriageC = marriageC.filter(q)

    total_records = marriageC.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(marriageC,request)
    serializer = MarriageCertificateSerializer(page,many=True, context={'request': request})
    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def Cmarriage_update(request,id):
    cmarriage  = get_object_or_404(Marriagecertificate,id=id)
    serializer = MarriageCertificateSerializer(cmarriage,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminRole])
def Cmarriage_update_status(request, id):
    return admin_update_status(request, Marriagecertificate, MarriageCertificateSerializer, id)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def Cmarriage_delete(request,id):
    cmarriage  = get_object_or_404(Marriagecertificate,id=id)
    cmarriage.delete()
    return Response({'message':'Marriage Certificate Deleted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creat_incomeCertificate(request):
    serializer = IncomeCertificateSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(citizen=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetMyIncomeCertificates(request):
    incomeC = Incomecertificate.objects.filter(citizen=request.user).order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        incomeC = incomeC.filter(q)

    total_records = incomeC.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(incomeC,request)
    serializer = IncomeCertificateSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getIncomeCertificatePdf(request,id):
    try:
        incomec = Incomecertificate.objects.get(status='Completed',citizen=request.user,id=id)
        serializer = IncomeCertificateSerializer(incomec)
        return Response(serializer.data)
    except Incomecertificate.DoesNotExist:
        return Response(
            {'error': 'Completed Marriage certificate not found.'},
                status=404
            )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cincome_update(request,id):
    cincome  = get_object_or_404(Incomecertificate,id=id)
    serializer =IncomeCertificateSerializer(cincome,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminRole])
def cincome_update_status(request, id):
    return admin_update_status(request, Incomecertificate, IncomeCertificateSerializer, id)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cincome_delete(request,id):
    cincome  = get_object_or_404(Incomecertificate,id=id)
    cincome.delete()
    return Response({'message':'Income Certificate Deleted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def creat_CasteCertificate(request):
    serializer = CasteCertificateSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(citizen=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetMyCasteCertificates(request):
    casteC = Castecertificate.objects.filter(citizen=request.user).order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        casteC = casteC.filter(q)

    total_records = casteC.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(casteC,request)
    serializer = CasteCertificateSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCasteCertificatePdf(request):
    try:
        castec = Castecertificate.objects.get(status='Completed',citizen=request.user,id=id)
        serializer = CasteCertificateSerializer(castec)
        return Response(serializer.data)
    except Castecertificate.DoesNotExist:
        return Response(
            {'error': 'Completed Caste certificate not found.'},
                status=404
            )

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def Ccaste_update(request,id):
    Ccaste  = get_object_or_404(Castecertificate,id=id)
    serializer =CasteCertificateSerializer(Ccaste,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminRole])
def Ccaste_update_status(request, id):
    return admin_update_status(request, Castecertificate, CasteCertificateSerializer, id)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def Ccaste_delete(request,id):
    Ccaste  = get_object_or_404(Castecertificate,id=id)
    Ccaste.delete()
    return Response({'message':'Caste Certificate Deleted'})

@api_view(['POST'])
@permission_classes([AllowAny])
def creat_Tax(request):
    serializer = TaxesSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetTaxbyId(request,id):
    tax = get_object_or_404(Taxes, id=id)
    return Response(TaxesSerializer(tax).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetTaxes(reques):
    taxes = Taxes.objects.all()
    return Response(TaxesSerializer(taxes, many=True).data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def tax_update(request,id):
    tax  = get_object_or_404(Taxes,id=id)
    serializer =TaxesSerializer(tax,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def tax_delete(request,id):
    tax  = get_object_or_404(Taxes,id=id)
    tax.delete()
    return Response({'message':'Tax Deleted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request, tax_id):
    if request.user.role != 'citizen':
        return Response(
            {'detail': 'Only citizens can make tax payments.'},
            status=status.HTTP_403_FORBIDDEN
        )

    tax = get_object_or_404(Taxes, id=tax_id)

    try:
        amount = Decimal(str(request.data.get('amount', ''))).quantize(Decimal('0.01'))
        if amount < Decimal('1') or amount > Decimal('100000'):
            raise InvalidOperation
    except InvalidOperation:
        return Response({'detail': 'Enter an amount between 1 and 100000.'}, status=400)

    txnid = 'txn' + uuid.uuid4().hex[:18]
    productinfo = tax.tax_name[:100]
    firstname = (request.user.username or 'citizen')[:50]
    email = request.user.email or 'citizen@example.com'

    ClientPayment.objects.create(
        citizen=request.user,
        tax=tax,
        amount=amount,
        gateway_order_id=txnid,
    )

    hash_string = '|'.join(
        [settings.PAYU_KEY, txnid, str(amount), productinfo, firstname, email]
        + [''] * 10
        + [settings.PAYU_SALT]
    )

    return Response({
        'action': settings.PAYU_URL,
        'fields': {
            'key': settings.PAYU_KEY,
            'txnid': txnid,
            'amount': str(amount),
            'productinfo': productinfo,
            'firstname': firstname,
            'email': email,
            'phone': request.user.phone,
            'surl': settings.BACKEND_URL + '/capture-payment/',
            'furl': settings.BACKEND_URL + '/capture-payment/',
            'hash': sha512(hash_string),
        },
    })


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def capture_payment(request):
    d = request.data
    txnid = d.get('txnid', '')
    pu_status = d.get('status', '')          

    parts = [settings.PAYU_SALT, pu_status] + [''] * 10 + [
        d.get('email', ''), d.get('firstname', ''), d.get('productinfo', ''),
        d.get('amount', ''), txnid, d.get('key', ''),
    ]
    if d.get('additionalCharges'):
        parts.insert(0, d.get('additionalCharges'))
    reverse = '|'.join(parts)

    payment = ClientPayment.objects.filter(gateway_order_id=txnid).first()
    genuine = sha512(reverse) == d.get('hash', '')

    try:
        amount_ok = bool(payment) and Decimal(str(d.get('amount', '0'))) == payment.amount
    except InvalidOperation:
        amount_ok = False

    if payment and payment.status != 'Paid':
        if genuine and amount_ok and pu_status == 'success':
            payment.status = 'Paid'
            payment.gateway_payment_id = str(d.get('mihpayid', ''))
        else:
            payment.status = 'Failed'
        payment.save()

    return HttpResponseRedirect(settings.FRONTEND_URL + '/my-payments?txn=' + txnid)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_payments(request):
    payments = ClientPayment.objects.filter(citizen=request.user).order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(tax__tax_name__icontains=search)|
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        payments = payments.filter(q)

    total_records = payments.count() 
    
    paginator = PageNumberPagination()
    paginator.page_size = 7

    page = paginator.paginate_queryset(payments,request)

    serializer = ClientPaymentSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def clientPayment_update(request,id):
    clientPayments  = get_object_or_404(ClientPayment,id=id)
    serializer =ClientPaymentSerializer(clientPayments,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminRole])
def payment_update_status(request, id):
    return admin_update_status(request, ClientPayment, ClientPaymentSerializer, id)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clientPayment_delete(request,id):
    clientPayment  = get_object_or_404(ClientPayment,id=id)
    clientPayment.delete()
    return Response({'message':'Client Payment Deleted'})

# ADMIN

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Staff_register(request):
    
    serializer = StaffRegisterationSerializer(data=request.data)
    
    if serializer.is_valid():
        staff=serializer.save()

        refresh = RefreshToken.for_user(staff)
        
        return Response({
            "status":"Success",
            "message":'Staff Register Successfully',
            
            "tokens":{
                "refresh":str(refresh),
                "access":str(refresh.access_token)
            },
            "staff":{
            "id":staff.id,
            "username":staff.username,
            "last_name":staff.last_name,
            "email":staff.email,
            "phone":staff.phone,
            "address":staff.address,
            "district":staff.district,
            "dob":staff.dob,
            "id_proof":staff.id_proof,
            "date_joined":staff.date_joined,
            "role":staff.role,
            "staff_designation":staff.staff_designation,
            "staff_status":staff.staff_status,
        }
        },
          status=status.HTTP_201_CREATED      
        )
    return Response({
        "status":"error",
        "message":serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetStaffs(request):
    staff = User.objects.filter(role='staff').order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(username__icontains=search) |
            Q(staff_status__icontains=search) |
            Q(staff_designation__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        staff = staff.filter(q)

    total_records = staff.count() 

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(staff,request)

    serializer = StaffRegisterationSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAllCitizens(request):
    citizens = User.objects.filter(role__in=['citizen', 'staff']).order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(username__icontains=search) |
            Q(staff_status__icontains=search) |
            Q(email__icontains=search) |
            Q(staff_designation__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        citizens = citizens.filter(q)

    total_records = citizens.count() 

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(citizens,request)

    serializer = RegisterSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def staff_update(request,id):
    staff  = get_object_or_404(User,id=id,role='staff')
    serializer =StaffRegisterationSerializer(staff,data=request.data,partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data,status=status.HTTP_200_OK)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def staff_delete(request,id):
    staffs  = User.objects.filter(role='staff',id=id)
    staffs.delete()
    return Response({'message':'User Deleted'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def citizen_delete(request,id):
    citizen  = User.objects.filter(role='citizen',id=id)
    citizen.delete()
    return Response({'message':'User Deleted'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAllApplications(request):
    application = ServiceApplication.objects.all().order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(service__title__icontains=search) |
            Q(status__icontains=search) |
            Q(remarks__icontains=search) |
            Q(description__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        application = application.filter(q)
        
    total_records = application.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7

    page = paginator.paginate_queryset(application,request)

    serializer = ServiceApplicationSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAllBirthCertificates(request):
    birthC = Birthcertificate.objects.all().order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        birthC = birthC.filter(q)

    total_records = birthC.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(birthC,request)

    serializer = BirthCertificateSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAllDeathCertificates(request):
    deathC = Deathcertificate.objects.all().order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        deathC = deathC.filter(q)

    total_records = deathC.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(deathC,request)
    serializer = DeathCertificateSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAllMarriageCertificates(request):
    marriageC = Marriagecertificate.objects.all().order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        marriageC = marriageC.filter(q)

    total_records = marriageC.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(marriageC,request)
    serializer = MarriageCertificateSerializer(page,many=True, context={'request': request})
    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAllIncomeCertificates(request):
    incomeC = Incomecertificate.objects.all().order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        incomeC = incomeC.filter(q)

    total_records = incomeC.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(incomeC,request)
    serializer = IncomeCertificateSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAllCasteCertificates(request):
    casteC = Castecertificate.objects.all().order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        casteC = casteC.filter(q)

    total_records = casteC.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7
    page = paginator.paginate_queryset(casteC,request)
    serializer = CasteCertificateSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def All_payments(request):
    payments = ClientPayment.objects.all().order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(citizen__icontains=search) |
            Q(tax__tax_name__icontains=search)|
            Q(status__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        payments = payments.filter(q)

    total_records = payments.count() 
    
    paginator = PageNumberPagination()
    paginator.page_size = 7

    page = paginator.paginate_queryset(payments,request)

    serializer = ClientPaymentSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetServiceStaffs_Applications(request):
    application = ServiceApplication.objects.filter(status__in=['Approved','In Progress']).order_by('-id')

    search = request.query_params.get('search','').strip()
    if search:
        q = (
            Q(service__title__icontains=search) |
            Q(status__icontains=search) |
            Q(remarks__icontains=search) |
            Q(description__icontains=search)
        )
        if search.isdigit() and len(search) <= 9:
            q |= Q(id=int(search))
        application = application.filter(q)
        
    total_records = application.count()

    paginator = PageNumberPagination()
    paginator.page_size = 7

    page = paginator.paginate_queryset(application,request)

    serializer = ServiceApplicationSerializer(page,many=True, context={'request': request})

    response = paginator.get_paginated_response(serializer.data)

    response.data['count'] = total_records

    return response

# CHAT BOT 
@api_view(["POST"])
@permission_classes([AllowAny])
def chatbot_api(request):
    question = request.data.get("question", "")

    if not isinstance(question, str) or not question.strip():
        return Response(
            {"error": "Please enter a question."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        answer = answer_question(question)

        return Response({
            "question": question,
            "answer": answer
        })

    except Exception:
        return Response(
            {
                "error": "The chatbot is temporarily unavailable. Please try again."
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
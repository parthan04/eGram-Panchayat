from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class User(AbstractUser):

    STAFF_STATUS = [
        ('ACTIVE','ACTIVE'),
        ('RESIGNED','RESIGNED'),
        ('TRANSFERRED','TRANSFERRED'),
        ('RETIRED','RETIRED'),
        ('TERMINATED','TERMINATED'),
        ('SUSPENDED','SUSPENDED'),
        ('ABSENT','ABSENT')
    ]

    STAFF_DESIGNATION=[
        ('Taxation and Revenue Staff','Taxation and Revenue Staff'),
        ('Village Development Officer','Village Development Officer'),
    ]

    USER_STATUS=[
        ('Admitted','Admitted'),
        ('Terminated','Terminated'),
    ]

    ROLES = [('citizen', 'Citizen'), ('staff', 'Staff'), ('admin', 'Admin')]

    phone = models.CharField(max_length=10)
    address = models.CharField(max_length=255)
    district = models.CharField(max_length=255)
    dob = models.DateField()
    id_proof = models.CharField(max_length=255)
    staff_designation = models.CharField(max_length=255,choices=STAFF_DESIGNATION,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    staff_status = models.CharField(max_length=30,choices=STAFF_STATUS,default='ACTIVE')
    status = models.CharField(max_length=30,choices=USER_STATUS,default='Admitted')
    role = models.CharField(max_length=10, choices=ROLES, default='citizen')

    def __str__(self):
        return self.username

class Services(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    def __str__(self):
        return self.title   

class ServiceApplication(models.Model):

    STATUS=[
        ('Pending','Pending'),
        ('Approved','Approved'),
        ('Rejected','Rejected'),
        ('In Progress','In Progress'),
        ('Completed','Completed')
    ]
     
    citizen = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    service = models.ForeignKey('Services',on_delete=models.PROTECT)
    phone   = models.CharField(max_length=10)
    address = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255,blank=True)
    attachment = models.FileField(
        upload_to='service_applications/',
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default='Pending'
    )
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"{self.citizen}-{self.service}-{self.status}"

class News(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)        
    published_on = models.DateField()
    expired_on = models.DateField()

    def __str__(self):
        return self.title


STATUS=[
    ('Pending','Pending'),
    ('Accepted','Accepted'),
    ('Rejected','Rejected'),
    ('In Progress','In Progress'),
    ('Completed','Completed')
]

GENDER = [
    ('Female','Female'),
    ('male','male'),
]

class Birthcertificate(models.Model):

    citizen = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    fname    = models.CharField(max_length=255)
    lname    = models.CharField(max_length=255)
    dob  = models.DateField()
    id_proof = models.FileField(upload_to='BirthCertificate/')
    b_date  = models.DateField()
    b_place = models.CharField(max_length=255)
    b_weight = models.DecimalField(decimal_places=2,max_digits=12)
    b_time  = models.TimeField(blank=True,null=True)
    gender  = models.CharField(choices=GENDER,max_length=25)
    phone   = models.CharField(max_length=255)
    email   = models.EmailField()
    father_name   = models.CharField(max_length=255)
    mother_name   = models.CharField(max_length=255)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status  =  models.CharField(max_length =30,choices=STATUS,default='Accepted')
    
    def __str__(self):
        return self.citizen.username

class Deathcertificate(models.Model):

    citizen = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    d_name = models.CharField(max_length=255)
    d_place = models.CharField(max_length =255)
    d_date  = models.DateField()
    d_place = models.CharField(max_length =255)
    d_time  = models.TimeField(blank=True,null=True)
    d_proof = models.FileField(upload_to='DeathCertificate-proof/')
    cause_d = models.CharField(max_length=255)
    gender  = models.CharField(choices=GENDER,max_length=25)
    phone   = models.CharField(max_length=255)
    email   = models.EmailField()
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status  =  models.CharField(max_length =30,choices=STATUS,default='Accepted')
    
    def __str__(self):
        return self.citizen.username

class Marriagecertificate(models.Model):

    citizen = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    h_name   = models.CharField(max_length=255)
    w_name   = models.CharField(max_length=255)
    date_of_marriage = models.DateField()
    address = models.TextField()
    place_of_marriage = models.CharField(max_length=255)
    marriage_reg_no = models.CharField(max_length=255)
    m_husband_id_proof = models.FileField(upload_to='MarriageCertificate-husband-id-proof/')
    m_wife_id_proof = models.FileField(upload_to='MarriageCertificate-wife-id-proof/')
    phone   = models.CharField(max_length=255)
    email   = models.EmailField()
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status  =  models.CharField(max_length =30,choices=STATUS,default='Accepted')
    
    def __str__(self):
        return self.citizen.username

class Castecertificate(models.Model):

    citizen = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    caste = models.CharField(max_length=255)
    phone = models.CharField(max_length=10)
    address = models.TextField()
    email  = models.EmailField()
    dob  = models.DateField()
    parent_name = models.CharField(max_length=255)
    religion = models.CharField(max_length=255)
    ration_card_no = models.CharField(max_length=255)
    gender  = models.CharField(choices=GENDER,max_length=25)
    sslc_certificate = models.FileField(upload_to='caste-sslc-certificate/')
    id_proof = models.FileField(upload_to='caste-id-proof/')
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status  =  models.CharField(max_length =30,choices=STATUS,default='Accepted')
    
    def __str__(self):
        return self.citizen.username

class Incomecertificate(models.Model):

    citizen = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    phone = models.CharField(max_length=10)
    address = models.TextField()
    dob  = models.DateField()
    email  = models.EmailField()
    parent_name = models.CharField(max_length=255)
    ration_card_no = models.CharField(max_length=255)
    gender  = models.CharField(choices=GENDER,max_length=25)
    id_proof = models.FileField(upload_to='income-id-proof/')
    occupation = models.CharField(max_length=255)
    income = models.CharField(max_length=255)
    inc_src = models.FileField(upload_to='income-source-certificate/')
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status  =  models.CharField(max_length =30,choices=STATUS,default='Accepted')
    
    def __str__(self):
        return self.citizen.username

class Taxes(models.Model):
    
    tax_name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.tax_name

class ClientPayment(models.Model):

    STATUS = [
        ('Pending', 'Pending'), 
        ('Paid', 'Paid'), 
        ('Failed', 'Failed'),
        ('Rejected', 'Rejected'),
        ('Approved', 'Approved'),
        ('Completed','Completed')
        ]

    citizen = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tax = models.ForeignKey(Taxes, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    gateway_order_id = models.CharField(max_length=100, unique=True)
    gateway_payment_id = models.CharField(max_length=100, blank=True)
    remarks = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=30, choices=STATUS, default='Pending')

    def __str__(self):
        return self.tax.tax_name

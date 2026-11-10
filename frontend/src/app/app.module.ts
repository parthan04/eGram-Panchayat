import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContentpageComponent } from './contentpage/contentpage.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { MyApplicationComponent } from './my-application/my-application.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServiceApplComponent } from './service-appl/service-appl.component';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BirthCertificateComponent } from './certificates/birth-certificate/birth-certificate.component';
import { DeathCertificateComponent } from './certificates/death-certificate/death-certificate.component';
import { MarriageCertificateComponent } from './certificates/marriage-certificate/marriage-certificate.component';
import { IncomeCertificateComponent } from './certificates/income-certificate/income-certificate.component';
import { CasteCertificateComponent } from './certificates/caste-certificate/caste-certificate.component';
import { ViewCertificateComponent } from './certificates/view-certificate/view-certificate.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { StaffLoginComponent } from './staff/staff-login/staff-login.component';
import { PaymentComponent } from './payment/payment.component';
import { TaxComponent } from './tax/tax.component';
import { ViewPaymentsComponent } from './view-payments/view-payments.component';
import { StaffDashboardComponent } from './staff/staff-dashboard/staff-dashboard.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { StaffManagementComponent } from './admin/staff-management/staff-management.component';
import { ServicesManagementComponent } from './admin/services-management/services-management.component';
import { PaymentManagementComponent } from './admin/payment-management/payment-management.component';
import { ApplicationManagementComponent } from './admin/application-management/application-management.component';
import { CertificatesManagementComponent } from './admin/certificates-management/certificates-management.component';
import { NewsManagementComponent } from './admin/news-management/news-management.component';
import { ViewApplicationComponent } from './admin/view-application/view-application.component';
import { ViewApplicationsComponent } from './admin/view-applications/view-applications.component';
import { ViewTaxesComponent } from './admin/view-taxes/view-taxes.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { CommonModule } from '@angular/common';
import { BirthCertificatepdfComponent } from './certificates/birth-certificatepdf/birth-certificatepdf.component';
import { DeathCertificatepdfComponent } from './certificates/death-certificatepdf/death-certificatepdf.component';
import { MarriageCertificatepdfComponent } from './certificates/marriage-certificatepdf/marriage-certificatepdf.component';
import { IncomeCertificatepdfComponent } from './certificates/income-certificatepdf/income-certificatepdf.component';
import { CasteCertificatepdfComponent } from './certificates/caste-certificatepdf/caste-certificatepdf.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentpageComponent,
    AboutComponent,
    ServicesComponent,
    MyApplicationComponent,
    LoginComponent,
    RegisterComponent,
    ServiceApplComponent,
    BirthCertificateComponent,
    DeathCertificateComponent,
    MarriageCertificateComponent,
    IncomeCertificateComponent,
    CasteCertificateComponent,
    ViewCertificateComponent,
    AdminLoginComponent,
    StaffLoginComponent,
    PaymentComponent,
    TaxComponent,
    ViewPaymentsComponent,
    StaffDashboardComponent,
    UserManagementComponent,
    StaffManagementComponent,
    ServicesManagementComponent,
    PaymentManagementComponent,
    ApplicationManagementComponent,
    CertificatesManagementComponent,
    NewsManagementComponent,
    ViewApplicationComponent,
    ViewApplicationsComponent,
    ViewTaxesComponent,
    ChatbotComponent,
    BirthCertificatepdfComponent,
    DeathCertificatepdfComponent,
    MarriageCertificatepdfComponent,
    IncomeCertificatepdfComponent,
    CasteCertificatepdfComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

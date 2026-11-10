import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContentpageComponent } from './contentpage/contentpage.component';
import { ServicesComponent } from './services/services.component';
import { MyApplicationComponent } from './my-application/my-application.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { ServiceApplComponent } from './service-appl/service-appl.component';
import { BirthCertificateComponent } from './certificates/birth-certificate/birth-certificate.component';
import { DeathCertificateComponent } from './certificates/death-certificate/death-certificate.component';
import { MarriageCertificateComponent } from './certificates/marriage-certificate/marriage-certificate.component';
import { IncomeCertificateComponent } from './certificates/income-certificate/income-certificate.component';
import { CasteCertificateComponent } from './certificates/caste-certificate/caste-certificate.component';
import { ViewCertificateComponent } from './certificates/view-certificate/view-certificate.component';
import { TaxComponent } from './tax/tax.component';
import { PaymentComponent } from './payment/payment.component';
import { ViewPaymentsComponent } from './view-payments/view-payments.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { StaffLoginComponent } from './staff/staff-login/staff-login.component';
import { StaffDashboardComponent } from './staff/staff-dashboard/staff-dashboard.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { StaffManagementComponent } from './admin/staff-management/staff-management.component';
import { ServicesManagementComponent } from './admin/services-management/services-management.component';
import { ApplicationManagementComponent } from './admin/application-management/application-management.component';
import { PaymentManagementComponent } from './admin/payment-management/payment-management.component';
import { CertificatesManagementComponent } from './admin/certificates-management/certificates-management.component';
import { NewsManagementComponent } from './admin/news-management/news-management.component';
import { ViewApplicationComponent } from './admin/view-application/view-application.component';
import { ViewTaxesComponent } from './admin/view-taxes/view-taxes.component';
import { AdminGuard } from './role.guard';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { BirthCertificatepdfComponent } from './certificates/birth-certificatepdf/birth-certificatepdf.component';
import { DeathCertificatepdfComponent } from './certificates/death-certificatepdf/death-certificatepdf.component';
import { MarriageCertificatepdfComponent } from './certificates/marriage-certificatepdf/marriage-certificatepdf.component';
import { IncomeCertificatepdfComponent } from './certificates/income-certificatepdf/income-certificatepdf.component';
import { CasteCertificatepdfComponent } from './certificates/caste-certificatepdf/caste-certificatepdf.component';

const routes: Routes = [
  {path:'', component:ContentpageComponent},
  {path:'about', component:AboutComponent},
  {path:'services', component:ServicesComponent,canActivate:[authGuard]},
  {path:'application', component:MyApplicationComponent,canActivate:[authGuard]},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'service-appl/:id', component:ServiceApplComponent,canActivate:[authGuard]},
  {path:'birthC',component:BirthCertificateComponent,canActivate:[authGuard]},
  {path:'deathC',component:DeathCertificateComponent,canActivate:[authGuard]},
  {path:'marriageC',component:MarriageCertificateComponent,canActivate:[authGuard]},
  {path:'incomeC',component:IncomeCertificateComponent,canActivate:[authGuard]},
  {path:'casteC',component:CasteCertificateComponent,canActivate:[authGuard]},
  {path:'view-certificate',component:ViewCertificateComponent,canActivate:[authGuard]},
  {path:'taxes', component: TaxComponent, canActivate: [authGuard] },
  {path:'payment/:id', component: PaymentComponent, canActivate: [authGuard] },
  {path:'birthCertificatePdf/:id',component:BirthCertificatepdfComponent,canActivate:[authGuard]},
  {path:'deathCertificatePdf/:id',component:DeathCertificatepdfComponent,canActivate:[authGuard]},
  {path:'marriageCertificatePdf/:id',component:MarriageCertificatepdfComponent,canActivate:[authGuard]},
  {path:'incomeCertificatePdf/:id',component:IncomeCertificatepdfComponent,canActivate:[authGuard]},
  {path:'casteCertificatePdf/:id',component:CasteCertificatepdfComponent,canActivate:[authGuard]},

  {path:'admin_login',component:AdminLoginComponent},
  {path:'staff_login',component:StaffLoginComponent},
  {path:'chat-bot',component:ChatbotComponent},

  {path:'user_management',component:UserManagementComponent,canActivate:[AdminGuard]},
  {path:'staff_management',component:StaffManagementComponent,canActivate:[AdminGuard]},
  {path:'service_management',component:ServicesManagementComponent,canActivate:[AdminGuard]},
  {path:'application_management',component:ApplicationManagementComponent,canActivate:[AdminGuard]},
  {path:'payment_management',component:PaymentManagementComponent,canActivate:[AdminGuard]},
  {path:'certificate_management',component:CertificatesManagementComponent,canActivate:[AdminGuard]},
  {path:'news_management',component:NewsManagementComponent,canActivate:[AdminGuard]},
  {path:'view_application',component:ViewApplicationComponent,canActivate:[AdminGuard]},
  {path:'view_tax',component:ViewTaxesComponent,canActivate:[AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GramserviceService {

  api=environment.api;

  constructor(public http:HttpClient) { }

  // REGISTER
  registerUser(data:any){
    return this.http.post(this.api+'register/',data)
  }

  // Login
  loginUser(data:any){
    return this.http.post(this.api+'login/',data)
  }

  // create services
  create_service(data:any){
    return this.http.post(this.api+'create-services/',data)
  }

  // CREATE TAX
  create_tax(data:any){
    return this.http.post(this.api+'create-tax/',data)
  }

  // Load Guest Services
  readGuestServices(){
    return this.http.get(this.api+'guest-get-services/')
  }

  // Load Auth Services
  readAuthServices(){
    return this.http.get(this.api+'auth-get-services/')
  }

  // SERVICE APPLICATION
  serviceApplication(data:FormData,id:number){
    return this.http.post(this.api+'create-service-application/'+id+'/',data)
  }

  // Birth Certificate Pdf View
  birthCPdf(id:number){
    return this.http.get(this.api+'getBirthCertificatePdf/'+id+'/')
  }

  // Death Certificate Pdf View
  deathCPdf(id:number){
    return this.http.get(this.api+'getDeathCertificatePdf/'+id+'/')
  }

  // Marriage Certificate Pdf View
  marriageCPdf(id:number){
    return this.http.get(this.api+'getMarriageCertificatePdf/'+id+'/')
  }

  // Income Certificate Pdf View
  incomeCPdf(id:number){
    return this.http.get(this.api+'getIncomeCertificatePdf/'+id+'/')
  }

  // Caste Certificate Pdf View
  casteCPdf(id:number){
    return this.http.get(this.api+'getCasteCertificatePdf/'+id+'/')
  }

  // Get Service by id
  getService(id:number){
    return this.http.get(this.api+'get-service/'+id+'/')
  }

  // MyApplication
  getMyApplications(page:number, search: string = ''){
    return this.http.get(this.api+'get-my-applications/',{params:{page:String(page),search:search}})
  }

  // CREATE NEWS
  createNews(data:any){
    return this.http.post(this.api+'create-news/',data)
  }

  // READ NEWS
  readNews(){
    return this.http.get(this.api+'get-news/')
  }

  // CREATE BIRTH CERTIFICATE
  createBirthCertificate(data:any){
    return this.http.post(this.api+'create-birth-certificate/',data)
  }

  // READ BIRTH CERTIFICATE
  readBirthCertificate(page:number, search: string = ''){
    return this.http.get(this.api+'get-my-birth-certificates/',{params:{page:String(page),search:search}})
  }

  // CREATE DEATH CERTIFICATE
  createDeathCertificate(data:any){
    return this.http.post(this.api+'create-death-certificate/',data)
  }

  // READ DEATH CERTIFICATE
  readDeathCertificate(page:number, search: string = ''){
    return this.http.get(this.api+'get-my-death-certificates/',{params:{page:String(page),search:search}})
  }

  // CREATE MARRIAGE CERTIFICATE
  createMarriageCertificate(data:any){
    return this.http.post(this.api+'create-marriage-certificate/',data)
  }

  // READ MARRIAGE CERTIFICATE
  readMarriageCertificate(page:number, search: string = ''){
    return this.http.get(this.api+'get-my-marriage-certificates/',{params:{page:String(page),search:search}})
  }

  // CREATE INCOME CERTIFICATE
  createIncomeCertificate(data:any){
    return this.http.post(this.api+'create-income-certificate/',data)
  }

  // READ INCOME CERTIFICATE
  readIncomeCertificate(page:number, search: string = ''){
    return this.http.get(this.api+'get-my-income-certificates/',{params:{page:String(page),search:search}})
  }

  // CREATE CASTE CERTIFICATE
  createCasteCertificate(data:any){
    return this.http.post(this.api+'create-caste-certificate/',data)
  }

  // READ CASTE CERTIFICATE
  readCasteCertificate(page:number, search: string = ''){
    return this.http.get(this.api+'get-my-caste-certificates/',{params:{page:String(page),search:search}})
  }

  // Tax
  getTaxes() {
  return this.http.get(this.api + 'get-taxes/');
  }

  // Get Tax by id
  getTax(id: number) {
  return this.http.get(this.api + 'get-tax/' + id + '/');
  }

  // Create Payment Order
  createPaymentOrder(taxId: number, data: any) {
  return this.http.post(this.api + 'create-payment-order/' + taxId + '/', data);
  }

  // My Payments
  myPayments(page:number, search: string = '') {
  return this.http.get(this.api + 'my-payments/',{params:{page:String(page),search:search}});
  }

  // My Payment
  myPayment() {
  return this.http.get(this.api + 'my-payments/');
  }

  // Admin Login
  adminLogin(data: any) {
    return this.http.post(this.api + 'admin-login/', data);
  }

  // Staff Login
  staffLogin(data: any) {
    return this.http.post(this.api + 'staff-login/', data);
  }

  // Staff Register
  staffRegister(data:any){
    return this.http.post(this.api+'staff-register/',data)
  }

  // Read Staffs
  readStaffs(page:number, search: string = ''){
    return this.http.get(this.api+'get-staffs/',{params:{page:String(page),search:search}})
  }

  // All records

  getAllApplications(page:number, search: string = ''){
    return this.http.get(this.api+'get-all-applications/',{params:{page:String(page),search:search}})
  }

  getAllBirthCertificates(page:number, search: string = ''){
    return this.http.get(this.api+'get-all-birth-certificates/',{params:{page:String(page),search:search}})
  }

  getAllDeathCertificates(page:number, search: string = ''){
    return this.http.get(this.api+'get-all-death-certificates/',{params:{page:String(page),search:search}})
  }

  getAllMarriageCertificates(page:number, search: string = ''){
    return this.http.get(this.api+'get-all-marriage-certificates/',{params:{page:String(page),search:search}})
  }

  getAllIncomeCertificates(page:number, search: string = ''){
    return this.http.get(this.api+'get-all-income-certificates/',{params:{page:String(page),search:search}})
  }

  getAllCasteCertificates(page:number, search: string = ''){
    return this.http.get(this.api+'get-all-caste-certificates/',{params:{page:String(page),search:search}})
  }

  getAllPayments(page:number, search: string = ''){
    return this.http.get(this.api+'get-all-payments/',{params:{page:String(page),search:search}})
  }

  getAllCitizens(page:number, search: string = ''){
    return this.http.get(this.api+'get-all-citizens/',{params:{page:String(page),search:search}})
  }

  getServiceStaffApplications(page:number, search: string = ''){
    return this.http.get(this.api+'getService-Staff-Applications/',{params:{page:String(page),search:search}})
  }

  // Update Apis

  updateCertificate(type: string, id: number, data: any) {
    const urls: any = {
      birth:    'Cbirth-update-status/',
      death:    'Cdeath-update-status/',
      marriage: 'Cmarriage-update-status/',
      income:   'cincome-update-status/',
      caste:    'Ccaste-update-status/',
    };
    return this.http.put(this.api + urls[type] + id + '/', data);
  }

  update_service(id:number,data:any){
    return this.http.put(this.api+'service-update/'+id+'/',data)
  }

  updateApplicationStatus(id: number, data: any) {
    return this.http.put(this.api + 'serviceApplication-update-status/' + id + '/', data);
  }

  updatePaymentStatus(id: number, data: any) {
    return this.http.put(this.api + 'payment-update-status/' + id + '/', data);
  }

  updateCitizen(id: number, data: any) {
    return this.http.put(this.api + 'user_update/' + id + '/', data);
  }

  updateStaff(id: number, data: any) {
    return this.http.put(this.api + 'staff-update/' + id + '/', data);
  }

  // Delete Apis

  delete_services(id:number){
    return this.http.delete(this.api+'service-delete/'+id+'/')
  }

  delete_staff(id:number){
    return this.http.delete(this.api+'staff-delete/'+id+'/')
  }

  delete_citizen(id:number){
    return this.http.delete(this.api+'delete-citizen/'+id+'/')
  }

}

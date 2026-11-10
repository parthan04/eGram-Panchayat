import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GramserviceService } from 'src/app/gramservice.service';

@Component({
  selector: 'app-staff-management',
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css']
})
export class StaffManagementComponent implements OnInit {

     staff={username:"",last_name:"",phone:"",email:"",password:"",address:"",district:"",dob:"",id_proof:"",staff_status:"",staff_designation:"",role:""}
     errors:{[key:string]:string[]}={};
     submitting = false;
     isEdit = false;
     editId: number | null = null;
  
     constructor(public s:GramserviceService,private r:Router){}

     ngOnInit(): void {
      const data = history.state;
 
      if (data?.isEdit && data?.staff) {
        this.isEdit = true;
        this.editId = data.staff.id;

        this.staff = {
          ...this.staff,
          ...data.staff,
          password: ''
        };
      }
    }
  
     submit(): void {
      this.errors = {};

      if (this.submitting) {
        return;
      }
      
      this.submitting = true;

      const payload = { ...this.staff };

    const request =
      this.isEdit && this.editId !== null
        ? this.s.updateStaff(this.editId, payload)
        : this.s.staffRegister(payload);

    request.subscribe({
      next: () => {
        this.submitting = false;

        alert(
          this.isEdit
            ? 'STAFF UPDATED SUCCESSFULLY!'
            : 'STAFF REGISTRATION SUCCESSFUL!'
        );

        this.r.navigate(['/user_management']);
      },

      error: (err: any) => {
        this.submitting = false;
        this.errors = err.error?.message ?? err.error ?? {};

        console.error('Staff operation failed:', err.error);

        alert(
          this.isEdit
            ? 'Staff update failed'
            : 'Staff registration failed'
        );
      }
    });
  }

  hasError(field: string): boolean {
    return !!this.errors[field]?.length;
  }

  getError(field: string): string {
    return this.errors[field]?.[0] ?? '';
  }

}

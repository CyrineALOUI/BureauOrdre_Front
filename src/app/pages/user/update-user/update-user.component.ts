import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  editUser: User = new User();

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const idUser = this.route.snapshot.params['id'];
    this.userService.findUserById(idUser).subscribe(
      (data: User) => {
        this.editUser = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur', error);
      }
    );
  }

  updateUser() {

    const formData: FormData = new FormData();
    formData.append('currentUsername', this.editUser.username);
    formData.append('firstName', this.editUser.firstName);
    formData.append('lastName', this.editUser.lastName);
    formData.append('email', this.editUser.email);
    formData.append('role', this.editUser.role);
    formData.append('isActive', this.editUser.active.toString());
    formData.append('isNonLocked', this.editUser.notLocked.toString());
    formData.append('username', this.editUser.username);

    
    this.userService.updateUser(formData).subscribe(
      (data: User) => {
        console.log('Utilisateur mis à jour avec succès', data);
        this.router.navigate(['/list-user']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
      }
    );
  }

  
}

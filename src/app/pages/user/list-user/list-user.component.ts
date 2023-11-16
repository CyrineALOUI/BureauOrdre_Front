import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/models/user';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { CustomHttpRespone } from 'src/app/models/custom-http-response';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

  public users!: User[];
  private subscriptions: Subscription[] = [];
  searchTerm: string;
  searchedUsers: User[];
  public editUser = new User();
  private currentUsername: string;
  public selectedUser: User;
  currentPage: number = 1;
  itemsPerPage: number = 5;



  constructor(private userService: UserService,
              private notificationService: NotificationService,
              private router: Router) { }

  ngOnInit(): void {
    this.getUsers(true);
  }

  /*Afficher tous les utilisateurs*/
  public getUsers(showNotification: boolean): void {
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.searchedUsers = [...this.users];
          if(showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} utilisateurs chargés avec succès.` )
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )

  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if(message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur s"est produite, veuillez réessayer');
    }
  }

  /*Recherche dynamique*/
  public searchUsers(): void {
    const searchTermLowerCase = this.searchTerm.toLowerCase();

    if (searchTermLowerCase) {
      this.searchedUsers = this.users.filter(u => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        return fullName.includes(searchTermLowerCase) ||
               u.email.toLowerCase().includes(searchTermLowerCase) ||
               u.username.toLowerCase().includes(searchTermLowerCase)
      });
    } else {
      // Si le terme de recherche est vide, réinitialiser searchedUsers à la liste complète des utilisateurs
      this.searchedUsers = this.users.slice();
    }
  }

  /*Redirection add*/
  onAddUser() {
    this.router.navigateByUrl('/add-user');
  }

  /*Redirection update*/
  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.currentUsername = editUser.username;
    this.router.navigateByUrl('/update-user');
  }


  /*Supprimer user*/
  public onDeleteUser(username: string): void {
    this.subscriptions.push(
      this.userService.deleteUser(username).subscribe(
        (response: CustomHttpRespone) => {
          this.sendNotification(NotificationType.SUCCESS, response.message);
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }

  /*Pagination*/
  getTotalPages() {
    const totalItems = this.users.length;
    const itemsPerPage = this.itemsPerPage;
    return Math.ceil(totalItems / itemsPerPage);
  }

  getPages(): number[] {
    let pages: number[] = [];
    const totalPages = this.getTotalPages();
    const currentPage = this.currentPage;
    const maxPages = 5;

    if (totalPages <= maxPages) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
      const endPage = Math.min(totalPages, startPage + maxPages - 1);
      pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

      const hasLeftSpill = startPage > 1;
      const hasRightSpill = totalPages - endPage > 0;
      const spillOffset = maxPages - (endPage - startPage + 1);

      if (hasLeftSpill && !hasRightSpill) {
        const extraPages = Array.from({ length: spillOffset }, (_, i) => startPage - i - 1).reverse();
        pages = [...extraPages, ...pages];
      } else if (!hasLeftSpill && hasRightSpill) {
        const extraPages = Array.from({ length: spillOffset }, (_, i) => endPage + i + 1);
        pages = [...pages, ...extraPages];
      } else if (hasLeftSpill && hasRightSpill) {
        const leftSpill = Array.from({ length: spillOffset }, (_, i) => startPage - i - 1).reverse();
        const rightSpill = Array.from({ length: spillOffset }, (_, i) => endPage + i + 1);
        pages = [...leftSpill, ...pages, ...rightSpill];
      }
    }

    return pages;
  }












}

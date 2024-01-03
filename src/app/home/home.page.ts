import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private actionSheetCtrl: ActionSheetController) { }

  // isActionSheetOpen = false;

  // public actionSheetButtons = [
  //   {
  //     text: 'Delete',
  //     role: 'destructive',
  //     data: {
  //       action: 'delete',
  //     },
  //   },
  //   {
  //     text: 'Share',
  //     data: {
  //       action: 'share',
  //     },
  //   },
  //   {
  //     text: 'Cancel',
  //     role: 'cancel',
  //     data: {
  //       action: 'cancel',
  //     },
  //   },
  // ];

  // setOpen(isOpen: boolean) {
  //   this.isActionSheetOpen = isOpen;
  // }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Share',
          data: {
            action: 'share',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }
}

import { NgModule } from "@angular/core";
import { SplashPage } from "./splash.page";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SplashPageRoutingModule } from "./splash-routing.module";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SplashPageRoutingModule,
    ],
    declarations: [SplashPage]
})
export class SplashPageModule{}
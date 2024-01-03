import { RouterModule, Routes } from "@angular/router";
import { SignInPage } from "./signin.page";
import { NgModule } from "@angular/core";


const routes: Routes = [
    {
        path: '',
        component: SignInPage,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SignInPageRoutingModule {}
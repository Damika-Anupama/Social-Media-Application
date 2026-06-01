import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdditionalComponent } from "./additional/additional.component";
import { PaymentComponent } from "./payment/payment.component";
import { PricingComponent } from "./pricing/pricing.component";
import { PublishComponent } from "./publish/publish.component";
import { RequirementsComponent } from "./requirements/requirements.component";
import { VerificationComponent } from "./verification/verification.component";

const adRoutes: Routes = [
    { path: '', redirectTo: 'pricing', pathMatch: 'prefix' },
    { component: AdditionalComponent, path: 'add' },
    { component: PaymentComponent, path: 'payment' },
    { component: PricingComponent, path: 'pricing' },
    { component: PublishComponent, path: 'publish' },
    { component: RequirementsComponent, path: 'requirements' },
    { component: VerificationComponent, path: 'verify' },
];
@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(adRoutes)
    ],
    exports: [RouterModule]
})
export class AdsRoutingModule {}
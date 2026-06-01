import { NgModule } from "@angular/core";
import { AdditionalComponent } from "./additional/additional.component";
import { AdsRoutingModule } from "./ads-routing.module";
import { PaymentComponent } from "./payment/payment.component";
import { PricingComponent } from "./pricing/pricing.component";
import { PublishComponent } from "./publish/publish.component";
import { RequirementsComponent } from "./requirements/requirements.component";
import { VerificationComponent } from "./verification/verification.component";

@NgModule({
    declarations: [
      AdditionalComponent,
      PaymentComponent,
      PricingComponent,
      PublishComponent,
      RequirementsComponent,
      VerificationComponent,
      ],
    imports: [
        AdsRoutingModule
    ]
  })
  export class AdModule { }
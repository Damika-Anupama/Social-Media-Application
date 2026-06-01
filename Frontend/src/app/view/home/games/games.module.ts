import { NgModule } from "@angular/core";
import { GamesRoutingModule } from "./games-routing.module";
import { LobbyComponent } from "./lobby/lobby.component";
import { PlayComponent } from "./play/play.component";
import { SplashboardComponent } from "./splashboard/splashboard.component";

@NgModule({
    declarations: [
      LobbyComponent,
      PlayComponent,
      SplashboardComponent
      ],
    imports: [
      GamesRoutingModule
    ]
  })
  export class GamesModule { }
  
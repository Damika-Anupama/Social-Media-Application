
/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 21/08/2021
 **/


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { PlayComponent } from './play/play.component';
import { SplashboardComponent } from './splashboard/splashboard.component';


const gameRoutes: Routes = [
    { path: '', redirectTo: 'lobby', pathMatch: 'prefix' },
    { component: LobbyComponent, path: 'lobby' },
    { component: PlayComponent, path: 'play' },
    { component: SplashboardComponent, path: 'splash/:boardName' },
];
@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(gameRoutes)
    ],
    exports: [RouterModule]
})
export class GamesRoutingModule {
}

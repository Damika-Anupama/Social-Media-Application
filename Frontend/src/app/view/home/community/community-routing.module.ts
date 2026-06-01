
/**
 * @author : Damika Anuapama Nanayakkara <damikaanupama@gmail.com>
 * @since : 27/06/2021
 **/


import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuComponent} from '@src/app/view/home/community/menu/menu.component';
import {PageComponent} from '@src/app/view/home/community/page/page.component';
import {BuildComponent} from '@src/app/view/home/community/build/build.component';


const comRoutes: Routes = [
  {path: '', redirectTo: 'menu', pathMatch: 'prefix'},
  {component: MenuComponent, path: 'menu'},
  {component: PageComponent, path: 'page/:pageName'},
  {component: BuildComponent, path: 'build'},
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(comRoutes)
  ],
  exports: [RouterModule]
})
export class CommunityRoutingModule {
}

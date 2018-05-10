import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialitiesComponent } from './specialities.component';


const routes: Routes = [
    {
        path: '',
        component: SpecialitiesComponent,
        data: {
                    breadcrumb: 'Спеціальності'
                }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpecialitiesRoutingModule { }
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminComponent} from './admin.component';
import {AddQuestionComponent} from './questions/add-question/add-question.component';
import {QuestionsComponent} from './questions/questions.component';
import {AdministratorsComponent} from './administrators/administrators.component';
import {StatisticComponent} from './statistic/statistic.component';
import {TestDetailsComponent} from './testdetails/component/test-details.component';
import {ResultsComponent} from './results/results.component';


const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'statistic',
                component: StatisticComponent,
                data: {
                    breadcrumb: 'Статистика'
                }
            },
            {
                path: 'groups',
                loadChildren: './groups/groups.module#GroupsModule'
            },
            {
                path: 'students',
                loadChildren: './students/students.module#StudentsModule'
            },
            {
                path: 'students/byGroup',
                loadChildren: './students/students.module#StudentsModule'
            },
            {
                path: 'faculties',
                loadChildren: './faculties/faculties.module#FacultiesModule',
            },
            {
                path: 'subjects',
                loadChildren: './subjects/subjects.module#SubjectsModule',
            },
            {
                path: 'specialities',
                loadChildren: './specialities/specialities.module#SpecialitiesModule',
                data: {
                    breadcrumb: 'Спеціальності'
                }
            },
            {
                path: 'administrators',
                loadChildren: './administrators/administrators.module#AdministratorsModule',
                data: {
                    breadcrumb: 'Адміністратори'
                }
            },
            {
                path: 'timetable',
                loadChildren: './timetable/timetable.module#TimetableModule',
            },
            {
                path: 'tests',
                loadChildren: './tests/tests.module#TestsModule'
            },
            {
                path: 'questions',
                component: QuestionsComponent
            },
            {
                path: 'add-question',
                component: AddQuestionComponent
            },
            {
                path: 'testdetails',
                component: TestDetailsComponent
            },
            {
                path: 'results',
                component: ResultsComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {
}

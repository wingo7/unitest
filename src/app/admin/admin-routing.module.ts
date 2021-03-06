import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {AddQuestionComponent} from './questions/add-question/add-question.component';
import {QuestionsComponent} from './questions/questions.component';
import {StatisticComponent} from './statistic/statistic.component';
import {TestDetailsComponent} from './testdetails/component/test-details.component';
import {FilterComponent} from './results/filter.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: 'statistic',
                component: StatisticComponent
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
                loadChildren: './faculties/faculties.module#FacultiesModule'
            },
            {
                path: 'subjects',
                loadChildren: './subjects/subjects.module#SubjectsModule'
            },
            {
                path: 'specialities',
                loadChildren: './specialities/specialities.module#SpecialitiesModule'
            },
            {
                path: 'administrators',
                loadChildren: './administrators/administrators.module#AdministratorsModule'
            },
            {
                path: 'timetable',
                loadChildren: './timetable/timetable.module#TimetableModule'
            },
            {
                path: 'subjects/tests',
                loadChildren: './tests/tests.module#TestsModule'
            },
            {
                path: 'subjects/tests/questions',
                component: QuestionsComponent
            },
            {
                path: 'add-question',
                component: AddQuestionComponent
            },
            {
                path: 'subjects/tests/testdetails',
                component: TestDetailsComponent
            },
            {
                path: 'results',
                component: FilterComponent
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

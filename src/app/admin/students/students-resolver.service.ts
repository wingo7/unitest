import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import IStudent from './interfaces/IStudent';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { StudentsService } from './students.service';
import IGroup from './interfaces/IGroup';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class StudentsResolver implements Resolve<IStudent[]> {
    constructor(private service: StudentsService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IStudent[]> {
        const id = route.paramMap.get('id');
        if (id) {
            return this.service.getStudentsByGroup(id).pipe(switchMap(
                data => this.onDataRetrieve(data)
            ));
        }
        if (!id) {
            return this.service.getStudents().pipe(switchMap(
                data => this.onDataRetrieve(data)
            ));
        }
    }
    onDataRetrieve(data: IStudent[]): Observable<IStudent[]> {
        const groupsArr: any[] = data.map(value => value.group_id);
        const body = JSON.stringify({entity: 'Group', ids: groupsArr});
        return this.service.getEntityValue(body).pipe(switchMap(
            response => {
                return this.processingData(data, response);
            }
        ));
    }
    processingData(response: IStudent[], groups: IGroup[]): Observable<IStudent[]> {
        return Observable.of(response.map(value => {
            const student: IStudent = {
                student_fname: value.student_fname,
                student_name: `${value.student_name} `,
                student_surname: `${value.student_surname} `,
                fullName: `${value.student_surname} ${value.student_name} ${value.student_fname}`,
                gradebook_id: value.gradebook_id,
                user_id: value.user_id,
                group_id: value.group_id,
                group: ''
            };
            // Adding group name to display it at table
            groups.forEach(val => {
                if (value.group_id === val.group_id) {
                student.group = val.group_name;
                }
            });
            return student;
        }));
    }
}

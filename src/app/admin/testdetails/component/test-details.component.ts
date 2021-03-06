import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {TestDetailsService} from '../sevices/test-details.service';
import {TestDetailCreateComponent} from '../modals/test-detail-create/test-detail-create.component';
import {ActivatedRoute} from '@angular/router';
import {DeleteConfirmComponent} from '../../../shared/delete-confirm/delete-confirm.component';
import {ResponseMessageComponent} from '../../../shared/response-message/response-message.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-testdetails',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.scss']
})

export class TestDetailsComponent implements OnInit {

  testDetails = [];
  testId: number;
  testName: string[];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private testDetailsService: TestDetailsService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.testId = params['id'];
      this.getTestDetails();
      this.getTestById();

    });

  }

  openDialog(testDetails: any) {
    const dialogRef = this.dialog.open(TestDetailCreateComponent, {
      disableClose: true,
      width: '450px',
      data: testDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTestDetails();
      }
    });
  }

  delete(id: number) {
    this.translate.get('ADMIN.TD.DELQ').subscribe(msg => {
      const dialogRef = this.dialog.open(DeleteConfirmComponent, {
        data: {message: msg}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.testDetailsService.deleteTestDetail(id).subscribe(() => {
            this.getTestDetails();
          }, err => {
            alert(err.error.response);
          });
        }
      }, (err) => {
        this.translate.get('ADMIN.TD.ERR').subscribe(ms => {
          this.dialog.open(ResponseMessageComponent, {
            width: '350px',
            data: {message: ms + `${err.error.response}`}
          });
        });
      }, () => {
        this.translate.get('ADMIN.TD.DELETED').subscribe(mg => {
          this.testDetailsService.openTooltip(mg);
        });
      });
    });
  }

  private getTestDetails() {
    this.testDetailsService.getTestDetails(this.testId).subscribe((resp: any[]) => {
      this.testDetails = (resp['response'] === 'no records') ? [] : resp;
    });
  }

  private getTestById(): void {
    this.testDetailsService.getTestById(this.testId).subscribe((resp: any[]) => {
      this.testName = resp[0].test_name;
    });
  }

}

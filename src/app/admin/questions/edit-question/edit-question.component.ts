import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {QuestionsService} from '../questions.service';
import {QuestionsComponent} from '../questions.component';
import {IAnswer, IQuestion, IResponse} from '../questions-interface';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {DeleteConfirmComponent} from '../../../shared/delete-confirm/delete-confirm.component';
import {ResponseMessageComponent} from '../../../shared/response-message/response-message.component';


@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss'],
  providers: [QuestionsService]
})
export class EditQuestionComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionsService,
    private dialog: MatDialog, // for deleting answer confirmation
    private matDialogRefPopUp: MatDialogRef<EditQuestionComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {}



  public questionsComponent: QuestionsComponent;

  form: FormGroup;
  isFirstNumberIncorrect = false;
  isSecondNumberIncorrect = false;

  sel_question_test_name = this.data.sel_TestName;

  sel_question_id = this.data.sel_quest.question_id;
  sel_question_type = this.data.sel_quest.type;
  sel_question_test_id = this.data.sel_quest.test_id;

  // sel_question: IQuestion = this.data.sel_quest;
  sel_question: IQuestion = {
    question_id: this.data.sel_quest.question_id,
    test_id: this.data.sel_quest.test_id,
    question_text: this.data.sel_quest.question_text,
    level: this.data.sel_quest.level,
    type: this.data.sel_quest.type,
    attachment: this.data.sel_quest.attachment
  };
  // edited_question: IQuestion = this.data.sel_quest;
  edited_question: IQuestion = {
    question_id: this.data.sel_quest.question_id,
    test_id: this.data.sel_quest.test_id,
    question_text: this.data.sel_quest.question_text,
    level: this.data.sel_quest.level,
    type: this.data.sel_quest.type,
    attachment: this.data.sel_quest.attachment
  };

  receivedAnswersArray = [];
  editedAnswersArray = [];
  answersIdNumbersArray = [];
  correctAnswerInputType = 'radio';


  ngOnInit() {
    console.log('this.sel_question OnInit = ', this.sel_question);
    console.log('this.data.sel_TestName = ', this.data.sel_TestName);

    this.getAnswersOfSelectedQuestion(this.sel_question_id);
    this.setCorrectAnswerInputType();

    this.form = new FormGroup({
    });
  }


  setQuestionLevel(elem: HTMLSelectElement) {
    const value = elem.options[elem.selectedIndex].value;
    this.edited_question.level = value;
    console.log('level = ', value);
  }

  setQuestionText(elem: HTMLSelectElement) {
    const value = elem.value;
    this.edited_question.question_text = value;
    console.log('QuestionText = ', value);
  }

  setQuestionAttachment(event) {
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () => {
      this.edited_question.attachment = fileReader.result;
      this.sel_question.attachment = this.edited_question.attachment;
    };
    fileReader.readAsDataURL(img);
  }

  resetQuestionAttachment() {
    this.edited_question.attachment = '';
    this.sel_question.attachment = '';
  }

  getAnswersOfSelectedQuestion(question_id) {
    this.questionService.getAnswersByQuestionId(question_id).subscribe(data => {
      if (data.length) {
        // this.receivedAnswersArray = data;
        this.receivedAnswersArray = [];
        data.forEach(element => this.receivedAnswersArray.push(JSON.stringify(element)) );
        this.editedAnswersArray = data;
        console.log('from getAnswersOfSelectedQuestion: receivedAnswersArray = ', this.receivedAnswersArray);
        console.log('from getAnswersOfSelectedQuestion: editedAnswersArray = ', this.editedAnswersArray);
        this.setAnswersIdNumbersArray();

        // creates two inputs for numerical question type
        if (this.correctAnswerInputType === 'num') {
          const NUMBER_PATTERN = /[-+]?[0-9]*\.[0-9]+$|^[-+]?[0-9]+\.$|^[-+]?[0-9]*$/;
          this.form = new FormGroup({
          '0': new FormControl(this.editedAnswersArray[0].answer_text, [Validators.required, Validators.pattern(NUMBER_PATTERN)]),
          '1': new FormControl(this.editedAnswersArray[1].answer_text, [Validators.required, Validators.pattern(NUMBER_PATTERN)])
          }/* , { updateOn: 'blur' } */);
        }


      } else {
        this.receivedAnswersArray = [];
        this.editedAnswersArray = [];
      }
    });
  }


  // set the array of id of received answers (if they exist) of the selected question
  setAnswersIdNumbersArray() {
    if (this.editedAnswersArray.length === 0) {
      console.log(
        'Завдання ще немає відповідей this.answersIdNumbersArray = ',
        this.answersIdNumbersArray
      );
    } else {
      for (let i = 0; i < this.editedAnswersArray.length; i++) {
        if (this.answersIdNumbersArray[i] !== Number(this.editedAnswersArray[i].answer_id) ) {
          this.answersIdNumbersArray[i] = Number( this.editedAnswersArray[i].answer_id );
        }
      }
    }
    console.log('from setAnswersIdNumbersArray: answersIdNumbersArray = ', this.answersIdNumbersArray);
  }


  addAnswer() {
    if (this.correctAnswerInputType === 'num') {

      if (this.editedAnswersArray.length === 0) {
        // creates two new answers
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '1', '');
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '1', '');
        this.getAnswersOfSelectedQuestion(this.sel_question_id);
      }

    } else {
      if (this.correctAnswerInputType === 'txt') {
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '1', ''); // true_answer=1
      } else {
        this.insertNewAnswerToDataBase(this.sel_question_id, '', '0', ''); // true_answer=0
      }

      this.form.addControl(
        (this.editedAnswersArray.length + 1).toString(),
        new FormControl('', [Validators.required])
      );

      this.getAnswersOfSelectedQuestion(this.sel_question_id);
    }
    console.log('from addAnswer: this.answersIdNumbersArray = ', this.answersIdNumbersArray);
    console.log('from addAnswer: this.editedAnswersArray = ', this.editedAnswersArray);
  }

  setCorrectAnswerInputType() {
    if (this.sel_question_type === '1') {
      this.correctAnswerInputType = 'radio';
    }
    if (this.sel_question_type === '2') {
      this.correctAnswerInputType = 'checkbox';
    }
    if (this.sel_question_type === '3') {
      this.correctAnswerInputType = 'txt';
    }
    if (this.sel_question_type === '4') {
      this.correctAnswerInputType = 'num';
    }
    console.log(
      'from setCorrectAnswerInputType: correctAnswerInputType = ',
      this.correctAnswerInputType
    );
  }

  onQuestionTypeSelect(event) {
    this.edited_question.type = event.target.value;

    if (event.target.value === '1') {
      this.correctAnswerInputType = 'radio';
      this.editedAnswersArray.forEach(element => { element.true_answer = '0'; }); // set all answers incorrect
    }
    if (event.target.value === '2') {
      this.correctAnswerInputType = 'checkbox';
      this.editedAnswersArray.forEach(element => { element.true_answer = '0'; }); // set all answers incorrect
    }
    if (event.target.value === '3') {
      this.correctAnswerInputType = 'txt';
      this.editedAnswersArray.forEach(element => { element.true_answer = '1'; }); // set all answers correct
    }
    if (event.target.value === '4') {
      this.correctAnswerInputType = 'num';
      this.addAnswer(); // sets only two input fields for NUMERICAL answers type
    }
    console.log('from onQuestTypeSelect: AnsType = ',  this.correctAnswerInputType, ', edQuestType = ', this.edited_question.type);
    console.log('from onQuestionTypeSelect: edited_question = ', this.edited_question);
    console.log('from onQuestionTypeSelect: editedAnswersArray = ', this.editedAnswersArray);
  }


  setAnsverAttachment(checkedIndex, event) {
    const fileReader = new FileReader();
    const img = event.target.files[0];
    fileReader.onload = () =>
      (this.editedAnswersArray[checkedIndex].attachment = fileReader.result);
    fileReader.readAsDataURL(img);
    console.log('this.editedAnswersArray = ', this.editedAnswersArray);
  }

/**
 *   verifies condition min_val<max_val
 */
  numericalIntervalLimitsValidator() {
      if (Number(this.editedAnswersArray[0].answer_text) >= Number(this.editedAnswersArray[1].answer_text)
      && this.editedAnswersArray[0].answer_text !== '' && this.editedAnswersArray[1].answer_text !== '') {
        this.isFirstNumberIncorrect = true;
        this.isSecondNumberIncorrect = true;
        this.form.get('0').setErrors({'incorrect': true});
        this.form.get('1').setErrors({'incorrect': true});
      } else {
        this.isFirstNumberIncorrect = false;
        this.isSecondNumberIncorrect = false;
        this.form.get('0').updateValueAndValidity();
        this.form.get('1').updateValueAndValidity();
      }
  }

  setAnsverText(checkedIndex, event) {
    const value = event.target.value;
    this.editedAnswersArray[checkedIndex].answer_text = value;

    if (this.correctAnswerInputType === 'num') {
      this.numericalIntervalLimitsValidator();
    }

    console.log('this.editedAnswersArray = ', this.editedAnswersArray);
    console.log(
      `editedAnswersArray[${checkedIndex}].answer_text = `,
      this.editedAnswersArray[checkedIndex].answer_text
    );
  }


  setAnswerCorrect(checkedIndex, event) {
    if (this.correctAnswerInputType === 'radio') {
      for (let index = 0; index < this.editedAnswersArray.length; index++) {
        this.editedAnswersArray[index].true_answer =
          index === checkedIndex ? '1' : '0';
      }
    }
    if (this.correctAnswerInputType === 'checkbox') {
      this.editedAnswersArray[checkedIndex].true_answer =
        this.editedAnswersArray[checkedIndex].true_answer === '0' ? '1' : '0';
    }
    if (
      this.correctAnswerInputType === 'txt' ||
      this.correctAnswerInputType === 'num'
    ) {
      for (let index = 0; index < this.editedAnswersArray.length; index++) {
        this.editedAnswersArray[index].true_answer = '1';
      }
    }
    console.log(`this.editedAnswersArray = `, this.editedAnswersArray);
  }


  insertNewAnswerToDataBase(
    questionId,
    answerText = '',
    trueAnswer = '',
    answerAttachment = ''
  ) {
    const newAnswerJSON = JSON.stringify({
      question_id: questionId,
      answer_text: answerText,
      true_answer: trueAnswer,
      attachment: answerAttachment
    });
    console.log('newAnswerJSON = ', newAnswerJSON);

    this.questionService.addAnswer(newAnswerJSON).subscribe((dataNewAnswer: IAnswer) =>
        console.log('Respond: added new answer = ', dataNewAnswer)
      );
  }

  deleteAnswerfromModal(checkedIndex) {
    this.editedAnswersArray.splice(checkedIndex, 1);
      this.answersIdNumbersArray.splice(checkedIndex, 1);
      console.log(`from deleteAnswerfromModal: this.answersIdNumbersArray = `, this.answersIdNumbersArray);
      console.log( `from deleteAnswerfromModal: this.editedAnswersArray = `,  this.editedAnswersArray );
  }


  deleteAnswerFromDataBase(checkedIndex): void {
    const checkedAnswerId = this.editedAnswersArray[checkedIndex].answer_id;
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      width: '400px',
      data: {
        message: 'Ви бажаєте видалити відповідь з бази даних?'
      }
    });

    dialogRef.afterClosed().subscribe( (dialogResponse: boolean) => {
      if (dialogResponse) {
        console.log( `from true dialogResponse = `, dialogResponse );

        this.questionService.deleteAnswer(checkedAnswerId).subscribe(
          (data: IResponse) => {
            if (data.response === 'ok') {
              this.dialog.open(ResponseMessageComponent, {
                width: '400px',
                data: { message: 'Відповідь з бази даних видалено!' }
              });

              this.deleteAnswerfromModal(checkedIndex);
            }
          },
          () => {
            this.dialog.open(ResponseMessageComponent, {
              width: '400px',
              data: { message: 'Виникла помилка при видаленні цієї відповіді з бази даних!'}
            });
          }
        );
      } else {
      console.log( `from else dialogResponse = `, dialogResponse );
      }

    });
  }



  editedQuestionSubmit() {
    let isQuestionEdited = false;
    let isAnyAnswerEdited = false;
    let editedAnswersNumber = 0;
    const questionJSON = JSON.stringify({
      question_id: this.sel_question_id,
      test_id: this.data.sel_quest.test_id,
      question_text: this.edited_question.question_text,
      level: this.edited_question.level,
      type: this.edited_question.type,
      attachment: this.edited_question.attachment
    });

      // updates question to database if it was changed
      if ( JSON.stringify(this.edited_question) !== JSON.stringify(this.sel_question) ) {
              this.questionService.editQuestion(this.sel_question_id, questionJSON)
              .subscribe((editedQuestion: IQuestion) => {
                console.log('Відредаговано завдання:  = ', editedQuestion);
                this.openModalMessage('Завдання відредаговано успішно!');
                isQuestionEdited = true;
                this.matDialogRefPopUp.close();
              });
      }

    this.editedAnswersArray.forEach((answer, index) => {
      answer.question_id = this.sel_question_id;
      // updates only those answers that don't coincide with any of the received
      if (  this.receivedAnswersArray.every(element =>  element !== JSON.stringify(answer) ) ) {

        isAnyAnswerEdited = true;

        this.questionService.editAnswer(answer.answer_id, answer).subscribe(
            (editedAnswer: IAnswer) => {
            console.log('Відредаговано відповідь: ', editedAnswer);
            },
            () => { // onError
              this.openModalMessage('Виникла помилка при редагуванні цієї відповіді в базі даних!');
            },
            () => { // onComplete
              editedAnswersNumber += 1;
              if (editedAnswersNumber === 1) { // shows openModalMessage only for first edited answer
                this.openModalMessage('Відповіді відредаговано успішно!');
                this.matDialogRefPopUp.close();
              }

            }
        );
      }

      if ( (index === this.editedAnswersArray.length - 1 ) && !isQuestionEdited && !isAnyAnswerEdited) {
        const dialogExit = this.dialog.open(DeleteConfirmComponent, {
          width: '400px',
          data: {message: 'Завдання та відповіді не відредаговано! Ви бажаєте вийти?'}
        });
        dialogExit.afterClosed().subscribe( (dialogResponse: boolean) => {
            if (dialogResponse) { this.matDialogRefPopUp.close(); }
        });
      }
    });
  }


  // Dialog modal message
  openModalMessage(msg: string, w: string = '400px'): void {
    this.dialog.open(ResponseMessageComponent, {
        width: w,
        data: { message: msg }
    });
  }


  closeDialog(): void {
    this.matDialogRefPopUp.close();
  }
}

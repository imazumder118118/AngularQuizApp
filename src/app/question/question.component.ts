import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval } from 'rxjs'



@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  public name:string="";
  public questionList : any=[];
  public currentQuestion: number =0;

  public points:number =0;
  public counter:number =60;

  public correctAnswer :number =0;
  public incorrectAnswer :number =0;

  public progress:string="0" ;

  interval$:any;

  constructor(private questionservice : QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startcounter();
  }

  getAllQuestions()
  {
    this.questionservice.getQuestionJson()
    .subscribe(res =>{
      this.questionList = res.questions;
    }

    )

  }
  nextQuestion()
  {
    //if(this.currentQuestion !=this.questionList.length)
    this.currentQuestion+=1;

  }
  previousQuestion()
    {

      this.currentQuestion--;
    }

    answer(currentQo:number,option:any)
    {
        if(option.correct)
        {
          this.points+=10;
          this.correctAnswer++;
          setTimeout(() => {
          this.currentQuestion+=1;
          this.resetcounter();
          this.getProgressPercent();
            
          }, 2000);
          
        
        }
        else
        {
          setTimeout(() => {
            this.currentQuestion++;
            this.incorrectAnswer++;
            this.resetcounter();
            this.getProgressPercent();
            
          }, 2000);
     

          this.points -=10;

        }
    }
    startcounter()
    {
      this.interval$ = interval(1000).subscribe(
        val=>{
          this.counter--;
          if(this.counter ===0)
          {
            this.currentQuestion++;
            this.counter = 60;
            this.points-=10;
          }

        }
      );
      setTimeout(() => {
        this.interval$.unsubscribe();
      }, 600000);

    }
    stopcounter()
    {
      this.interval$.unsubscribe();
      this.counter=0;

    }
    resetcounter()
    {
      this.stopcounter();
      this.counter = 60;
      this.startcounter();


    }
    resetQuiz()
    {
      this.resetcounter();
      this.getAllQuestions();
      this.points=0;
      this.counter =60;
      this.currentQuestion=0;
      this.progress= "0";


    }
  getProgressPercent()
  {
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }


}

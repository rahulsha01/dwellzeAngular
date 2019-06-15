import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'dwlz-broadcast-message',
    templateUrl: './broadcast-message.component.html'
})
export class BroadcastMessageComponent implements OnInit{
    broadcastForm:FormGroup;
    membersArr = ['Committe','Primary Members','All'];
    constructor(
        private fb:FormBuilder
    ){}
    ngOnInit(){
        this.initForm();
    }

    initForm(){
        this.broadcastForm = this.fb.group({
            message_text:[''],
            message_to:[[]]
        })
    }
    onChange(event, i) {
        const feat = event.source.value;
        if (event.checked) {
          this.broadcastForm.controls['message_to'].value.push(feat);
        } else {
          console.log(event.source.value);
          const index = this.broadcastForm.controls['message_to'].value.findIndex(x => x === feat);
          console.log(index);
          this.broadcastForm.controls['message_to'].value.splice(index, 1);
        }
      }

      onSubmit(){
        if(this.broadcastForm.valid){
            console.log(this.broadcastForm.value);
        }
      }
    
}
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class observerService {

    private approvalStageMessage = new BehaviorSubject('Basic Approval is required!');
    currentApprovalStageMessage = this.approvalStageMessage.asObservable();
    
    constructor() {

    }
    updateApprovalMessage(message: any) {
        this.approvalStageMessage.next(message)
    }
}
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../model/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() user: User;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.getChat();
  }


  getChat(){
    const id = +this.route.snapshot.paramMap.get('id');
    // this.heroService.getHero(id)
    //   .subscribe(hero => this.hero = hero);
  }

}

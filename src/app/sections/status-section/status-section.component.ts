import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Pipe } from "@angular/core";
@Component({
  selector: 'app-status-section',
  templateUrl: './status-section.component.html',
  styleUrls: ['./status-section.component.css']
})
export class StatusSectionComponent implements OnInit {
  page = 2;
  page1 = 3;  
  readonly apiURL: string;
  dadosCliente: any = [];

  constructor( private http: HttpClient) {
      this.apiURL = "http://www.mocky.io/v2/5c7552e43100009c20c23450"; }

  ngOnInit() {
    this.getRastreio();
  }

  ajustaData(data){
    let dataAjustada = data;
    if(data){
      if(data.toLocaleString().indexOf('/') == '4'){
        if(data.slice(5,7) > 12){
          dataAjustada = data.slice(0,4) + "/" + data.slice(8,10) + "/" + data.slice(5,7)
        }        
      } 
      data = new Date(dataAjustada);
      return data.toLocaleString()
    }
    return 'Sem data'
  }

  compare(a,b) {
    if(a.step && b.step){
      if (a.step < b.step)
        return -1;
     if (a.step > b.step)
      return 1;
    }
    return -1;
  }


  //#region 
  getRastreio() {
    // OK - 1
    // No Momento - 2
    // Pendente - 3
    this.http.get(`${this.apiURL}`).subscribe(
      (dados) => {
        let cont = 0;
        this.dadosCliente = dados;
        this.dadosCliente.status_history.sort(this.compare)
        this.dadosCliente.status_history.forEach(element => {
          element.status = 3;

        if(this.dadosCliente.status_history[cont].step){
          element.status = 2;
        } 

         if(this.dadosCliente.status_history[cont].step && this.dadosCliente.status_history[cont+1].step){
          element.status = 1;
        }
        

         cont++;
        });
        this.dadosCliente.payments.forEach(element => {
          if( element.name == 'adia'){
            element.name = 'Adiantamento'
         }
         
         if( element.name == 'canh'){
            element.name = 'Canhoto'
         }
         
         if( element.name == 'sald'){
            element.name = 'Saldo'
         }
          
        });
     
      },
      (erro) => {
        if (erro.status == 404) {
          console.log("Informação não localizada.");
        }
      }
    );
  }
  //#endregion

}

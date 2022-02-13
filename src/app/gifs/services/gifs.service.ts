import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string='PaVs5hailI0HMRYZrbjfMtIH1v5kGALS';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  private _historial:string[] = [];
  public resultados:gif[]=[];

  get historial(){
    
    return [...this._historial];
  }
  
  // constructor para inicializar el http
  constructor(private http:HttpClient){

    // aca se pasa lo guardado en el localstorage al historial
    if( localStorage.getItem('historial')  ){
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }

    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }



  buscarGifs(query:string = ''){
    query = query.trim().toLocaleLowerCase();


    // aca abajo tenemos el if para no repetir elementos buscados y cortar hasta 10
    if (!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);
      // desde aca guardamos el hisorial en la memoria local 
      localStorage.setItem('historial', JSON.stringify(this._historial));
    };
    
    // desde aca 
    const params = new HttpParams()
      .set('api_key',this.apiKey)
      .set('limit', '10')
      .set('q',query);
      
    // desde aca consumimos la api usando el http de angular
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params: params})
      .subscribe((resp) =>{
        console.log(resp.data);
        this.resultados=resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      })
  }


}

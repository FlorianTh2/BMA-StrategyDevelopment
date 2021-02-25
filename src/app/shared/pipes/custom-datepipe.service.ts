import { Injectable, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: "root"
})
export class CustomDatepipePipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return super.transform(value, "dd.MM.yyyy, HH:mm");
  }
}

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FilterValidationPipe implements PipeTransform {
  private readonly types: string[];
  constructor(types) {
    this.types = Object.values(types);
  }
  transform(value: any, metadata: ArgumentMetadata) {
    const performedValue = String(value).toUpperCase();

    const index = this.types.indexOf(performedValue);

    if (index === -1) {
      return null;
    }

    return performedValue;
  }
}

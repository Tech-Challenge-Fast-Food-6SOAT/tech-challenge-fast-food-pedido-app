export class CPF {
  private readonly value: string | null;

  public constructor(value: string) {
    this.value = this.create(value);
  }

  private create(value: string): string | null {
    const digits = value.replace(/\D/g, '');
    if (!this.isValid(digits)) {
      return null;
    }
    return digits;
  }

  public getValue(): string | null {
    return this.value;
  }

  private isValid(value: string): boolean {
    const cpfRegex = /^[0-9]{11}$/;
    return cpfRegex.test(value);
  }
}

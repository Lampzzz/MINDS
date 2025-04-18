export function getBirthDate(age: number): string {
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
  const year = birthDate.getFullYear();
  const month = String(birthDate.getMonth() + 1).padStart(2, "0");
  const day = String(birthDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

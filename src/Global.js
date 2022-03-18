export class Global {
  //static API_URL = 'https://localhost:44314/api/';
  static API_URL = 'https://webapi.emlakofisimden.com/api/';

  static catchMessage = 'A problem occurred, please contact us! 444 1 444';
}
export const app = {
  item: JSON.parse(localStorage.getItem('USER')),
  // licenceName: JSON.parse(localStorage.getItem('LICENCENAME'))
};

interface Item {
    id: number;
    name: string;
    value: string;
}

const allLocations: Item[] = [
    { 'id': 1, 'name': 'Barrie', 'value': 'Barrie' },
    { 'id': 2, 'name': 'Calgary', 'value': 'Calgary' },
    { 'id': 3, 'name': 'Edmonton', 'value': 'Edmonton' },
    { 'id': 4, 'name': 'Guelph', 'value': 'Guelph' },
    { 'id': 5, 'name': 'Halifax', 'value': 'Halifax' },
    { 'id': 6, 'name': 'Hamilton', 'value': 'Hamilton' },
    { 'id': 7, 'name': 'Kelowna', 'value': 'Kelowna' },
    { 'id': 8, 'name': 'Kitchener', 'value': 'Kitchener' },
    { 'id': 9, 'name': 'London', 'value': 'London' },
    { 'id': 10, 'name': 'Montreal', 'value': 'Montreal' },
    { 'id': 11, 'name': 'Oshawa', 'value': 'Oshawa' },
    { 'id': 12, 'name': 'Ottawa', 'value': 'Ottawa' },
    { 'id': 13, 'name': 'Quebec City', 'value': 'Quebec City' },
    { 'id': 14, 'name': 'Regina', 'value': 'Regina' },
    { 'id': 15, 'name': 'Saskatoon', 'value': 'Saskatoon' },
    { 'id': 16, 'name': 'St. Catharines', 'value': 'St. Catharines' },
    { 'id': 17, 'name': 'Toronto', 'value': 'Toronto' },
    { 'id': 18, 'name': 'Vancouver', 'value': 'Vancouver' },
    { 'id': 19, 'name': 'Victoria', 'value': 'Victoria' },
    { 'id': 20, 'name': 'Winnipeg', 'value': 'Winnipeg' }
]

export default allLocations;

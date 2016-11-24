import * as request from 'request';
import {Package} from './model';

export default function search(query: string): Promise<Package[]> {

    if (!query || !query.length) {
        return Promise.resolve([]);
    }

    const url = `https://packagesearch.azurewebsites.net/Search/?searchTerm=${query}`;

    return new Promise<Package[]>((resolve, reject) => {

        request(url, (err, resp, body) => {

            if (err) {
                reject(`ERROR: ${JSON.stringify(err)}`);
                return;
            }

            let results = JSON.parse(body || '');

            console.log('Search Results: ', results);

            if (!Array.isArray(results)) {
                reject('Response in invalid format');
                return;
            }

            let packages = results.map<Package>(x => x.PackageDetails),
                distinctPackages = distinct(packages, x => x.Name);

            resolve(distinctPackages);
        });

    });

}

function distinct<T>(array: T[], identifier: (item: T) => any): T[] {

        let distinct: T[] = [],
            unique = {};

        array.forEach(i => {
            let id = identifier(i);
            if (!unique[id]) {
                distinct.push(i);
            }
            unique[id] = true;
        });

        return distinct;
}

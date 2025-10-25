/*this is a interview-live-coding-test*/
/*
* 1. There is NPM JSON API for getting NPM packages info. For example the
2. following URL allows for getting information about the latest version of
3. "forever" package:
4.
5. http://registry.npmjs.org/forever/latest
6.
7. This request will result in a JSON, containing many fields, including
8. dependencies field:
9. dependencies:
10. {
11. cliff: "~0.1.9",
12. clone: "^1.0.2",
13. colors: "~0.6.2",
14. flatiron: "~0.4.2",
15. forever-monitor: "~1.7.0",
16. ...
17. }
18. This is a list of direct dependencies of an NPM package.
19.
20. Write a function getAllDependencies(packageName) which takes in
21. packageName parameter as a string and returns an array of strings of
22. both direct and all indirect (recursive) dependencies of the given
23. package, fetched from the API described above. For example, if A depends
24. on B, and B depends on C and D, getAllDependencies('A') should return
25. ['B', 'C', 'D']. The result should not contain duplicates.
26.
27. In a correct implementation, getAllDependencies("forever") should return
28. an array with length about 200+ (as of the time we wrote this question
29. and might be different in the future).
30.
31. Include a list of tools that needs to be installed to run your code and
32. instructions on how to run your program.
33.
34. NOTE:
35. - Don’t try to code your solution in browser environment, response from
36. NPM API will not pass CORS checks in browser.
37. - You should not care about package versions (only need the latest).
38. - You should not care about development dependencies.
39. - The function should return the array (or a promise of the array if
40. your function is async), instead of just printing the result.
41.
42. Base level expectations:
43. Code correctness
44. Code readability
45. Error-handling: do not assume your calls to the endpoint will always
46. succeed
47.
48. Bonus points for:
49. Use of concurrency
* */
const https = require('https');

/**
 * Fetches package information from NPM registry
 * @param {string} packageName - Name of the NPM package
 * @returns {Promise<Object>} Package dependencies object
 */
async function fetchPackageInfo(packageName) {
    return new Promise((resolve, reject) => {
        const url = `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`;

        https.get(url, { timeout: 5000 }, (res) => {
            let data = '';

            // Handle HTTP errors
            if (res.statusCode === 404) {
                console.warn(`Package not found: ${packageName}`);
                resolve({});
                return;
            }

            if (res.statusCode !== 200) {
                console.warn(`HTTP ${res.statusCode} for package: ${packageName}`);
                resolve({});
                return;
            }

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    // Return dependencies object, or empty object if not present
                    resolve(json.dependencies || {});
                } catch (error) {
                    console.warn(`Failed to parse JSON for ${packageName}:`, error.message);
                    resolve({});
                }
            });
        }).on('error', (error) => {
            console.warn(`Network error for ${packageName}:`, error.message);
            resolve({});
        }).on('timeout', () => {
            console.warn(`Timeout for package: ${packageName}`);
            resolve({});
        });
    });
}

/**
 * Processes a batch of packages concurrently
 * @param {Array<string>} packages - Array of package names to fetch
 * @returns {Promise<Array<Object>>} Array of dependencies objects
 */
async function fetchBatch(packages) {
    const promises = packages.map(pkg => fetchPackageInfo(pkg));
    // Use allSettled to continue even if some requests fail
    const results = await Promise.allSettled(promises);

    return results.map((result, index) => ({
        packageName: packages[index],
        dependencies: result.status === 'fulfilled' ? result.value : {}
    }));
}

/**
 * Gets all direct and indirect dependencies of an NPM package
 * @param {string} packageName - Name of the NPM package
 * @param {number} concurrency - Number of concurrent requests (default: 15)
 * @returns {Promise<Array<string>>} Array of all dependency names
 */
async function getAllDependencies(packageName, concurrency = 15) {
    const visited = new Set();
    const allDependencies = [];
    const queue = [packageName];

    // Mark the initial package as visited (we don't include it in results)
    visited.add(packageName);

    while (queue.length > 0) {
        // Process packages in batches for concurrency
        const batch = queue.splice(0, concurrency);
        const results = await fetchBatch(batch);

        for (const { packageName: currentPkg, dependencies } of results) {
            const depNames = Object.keys(dependencies);

            for (const dep of depNames) {
                if (!visited.has(dep)) {
                    visited.add(dep);
                    allDependencies.push(dep);
                    queue.push(dep);
                }
            }
        }

        // Optional: Log progress
        if (allDependencies.length > 0 && allDependencies.length % 50 === 0) {
            console.log(`Progress: Found ${allDependencies.length} dependencies, ${queue.length} packages in queue`);
        }
    }

    return allDependencies;
}

// Example usage and testing
async function main() {
    const packageName = process.argv[2] || 'forever';

    console.log(`Fetching all dependencies for: ${packageName}`);
    console.log('This may take a while...\n');

    const startTime = Date.now();

    try {
        const dependencies = await getAllDependencies(packageName);
        const endTime = Date.now();

        console.log(`\n✓ Completed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
        console.log(`✓ Found ${dependencies.length} unique dependencies\n`);
        console.log('Dependencies:', dependencies.sort());

        // Return for programmatic use
        return dependencies;
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

// Export for use as a module
module.exports = { getAllDependencies };
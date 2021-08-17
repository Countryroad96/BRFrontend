import axios from 'axios';

const END_POINT = '/v1/search/book.json';
const Client_ID = '6kzLim7jrHaqIQQcyTyH';
const Client_PW = 'TKnpNps3Gg';
const Search_Text = '해리포터';

function Api() {

    async function getSerchBook() {
        try{
            const response = await axios.get(END_POINT, {
                params: {
                    query: Search_Text
                },
                headers: {
                    'X-Naver-Client-Id': Client_ID,
                    'X-Naver-Client-Secret': Client_PW
                }
            });
            console.log(response.data.items);
        }
        catch (error) {
            console.log(error);
        }
    };

    getSerchBook();

    return (
        <>
            <div>
                <h1>Hello</h1>
            </div>
        </>
    );
}

export default Api;
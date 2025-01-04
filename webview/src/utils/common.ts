import _ from 'lodash'
// 한글 초성 검색
const searchByInitial = (text: string, keyword: string) => {
    const initialConsonants = [
        'ㄱ',
        'ㄲ',
        'ㄴ',
        'ㄷ',
        'ㄸ',
        'ㄹ',
        'ㅁ',
        'ㅂ',
        'ㅃ',
        'ㅅ',
        'ㅆ',
        'ㅇ',
        'ㅈ',
        'ㅉ',
        'ㅊ',
        'ㅋ',
        'ㅌ',
        'ㅍ',
        'ㅎ'
    ]
    keyword = _.trim(keyword)
    // 첫 글자가 한글인지 확인
    if (keyword.length === 1 && /[ㄱ-ㅎ]/.test(keyword)) {
        return (
            text.split('').filter((char) => {
                // '가' 유니코드 값
                const offset = 44032
                const chCode = char.charCodeAt(0) - offset
                const idx = Math.floor(chCode / 588)
                return initialConsonants[idx] === keyword
            }).length > 0
        )
    }
    return _.includes(text, keyword)
}
export default {
    searchByInitial
}

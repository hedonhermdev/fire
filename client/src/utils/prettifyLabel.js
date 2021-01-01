export default function prettifyLabel(label) {
    return label.split('_').map((word) => {
        return `${word[0].toUpperCase()}${word.slice(1, word.length)}`
    }).join(' ')
}
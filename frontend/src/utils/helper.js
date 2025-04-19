export const validateEmail = (email) => {
    const regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/g
    return regex.test(email)
}

// For user without profile image
export const getInitial = (fullName) => {
    if (!fullName) return '';

    const words = fullName.split(" ")
    const Initial = []

    for (let i = 0; i < words.length; i++) {
        const word = words[i]
        Initial.push(word[0].toUpperCase())
    }
    return Initial;
}

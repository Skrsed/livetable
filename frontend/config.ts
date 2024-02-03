const { MODE } = import.meta.env

const makeConfig = (): { [Key: string]: string } => {
    if (MODE === 'production') return {
        host: 'http://81.22.132.239'
    }
    if (MODE === 'development') return {
        host: 'http://localhost'
    }

    throw new Error('select mode')
}

const makeValue = () => {
    const config = makeConfig()

    return (key: string) => config[key]
}

const getValue = makeValue()

export const serverHost = getValue('host') 
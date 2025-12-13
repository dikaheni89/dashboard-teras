import { extendTheme } from "@chakra-ui/react"


export const colors = {
  primary: {
    main: '#000b42',
    50: '#f8f9ff',
    100: '#e5e9ff',
    200: '#ccd5ff',
    300: '#b3bcf5',
    400: '#99aedb',
    500: '#7f8ac1',
    600: '#6679a8',
    700: '#4d588f',
    800: '#333c75',
    900: '#1a295c',
    950: '#000a2b'
  }
}

const theme = extendTheme({
  colors
})

export const scrollBarStyle = {
  '&::-webkit-scrollbar': {
    width: '5px',
    height: '5px'
  },
  '&::-webkit-scrollbar-track': {
    background: colors.primary['100'],
    borderRadius: '10px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: colors.primary['500'],
    borderRadius: '10px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: colors.primary['800']
  }
}

export default theme

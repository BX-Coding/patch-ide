export const boxStyle = (selected: boolean, width: number, height: number) => ({
    backgroundColor: selected ? 'primary.dark' : 'none',
    borderColor: 'primary.dark',
    borderStyle: 'solid',
    borderWidth: 3,
    borderRadius: 1,
    '&:hover': {
        backgroundColor: 'primary.main',
        opacity: [0.9, 0.8, 0.7],
    },
    width: width,
    height: height,
    justifyContent: 'center'
})

export const typographyStyle = {margin: "4px"}
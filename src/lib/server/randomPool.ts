export const pickAnother = (pool: string[], current: string | null) => {
	const others = pool.filter((name) => name !== current)

	return others[Math.floor(Math.random() * others.length)] ?? null
}

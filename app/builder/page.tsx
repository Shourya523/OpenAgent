import Builder from '@/components/Builder'

export default function BuilderPage() {
    return (
        <>
            <div className='px-10 '>
                <h1 className="text-6xl mt-10 md:text-5xl lg:text-7xl font-bold tracking-tight text-foreground/90 leading-none">Workflow Builder</h1>
            </div>
            <div className='flex justify-center items-center m-10 border-1 rounded-lg'>
                <Builder />
            </div>
        </>

    )
}

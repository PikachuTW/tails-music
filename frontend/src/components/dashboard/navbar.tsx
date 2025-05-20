export default function NavbarComponent() {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Tails Music</a>
            </div>
            <div>
                <div className="btn btn-ghost flex items-center ">
                    <div className="avatar">
                        <div className="rounded-full size-7">
                            <img src="https://images-ext-1.discordapp.net/external/9SwJyubI7-eGGlgjkGaGJTnpq94rFpRZA6N3TQMRzEU/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/650604337000742934/005198bedb7ea4228752a3cccc6aac62.png?format=webp&quality=lossless&width=511&height=511" />
                        </div>
                    </div>
                    Tails
                </div>
            </div>
        </div>
    );
}

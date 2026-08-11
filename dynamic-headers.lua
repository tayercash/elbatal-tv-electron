
local headers = {
    "Referer: https://cc.cimanow.online/",

}

mp.register_event("file-loaded", function()
    for _, header in ipairs(headers) do
        mp.set_property_native("http-header-fields", header)
    end
end)

mp.commandv("loadfile", "https://deva-cpmav9sk6x.cimanowtv.com/uploads/2024/09/20/_Cima-Now.CoM_%20The.Penguin.S01E01.HD/%5BCima-Now.CoM%5D%20The.Penguin.S01E01.HD-480p.mp4")

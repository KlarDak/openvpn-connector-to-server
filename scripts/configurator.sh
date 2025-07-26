#!/bin/bash
cd /etc/openvpn/easy-rsa || exit 1

OUTPUT="/etc/openvpn/clients"

createConfig() {
if [ -f "pki/reqs/$2.req" ]; then
    return 2
fi;

./easyrsa build-client-full "$2" nopass

cat > "$OUTPUT/$2.ovpn" <<EOF
client
dev tun
proto udp
remote 192.168.1.98 1194
resolv-retry infinite
nobind

persist-key
persist-tun
remote-cert-tls server
cipher AES-256-CBC
auth SHA256
tls-version-min 1.2
key-direction 1
verb 3

<ca>
$(cat pki/ca.crt)
</ca>
<cert>
$(cat pki/issued/$2.crt)
</cert>
<key>
$(cat pki/private/$2.key)
</key>
<tls-auth>
$(cat ta.key)
</tls-auth>
EOF

return 0
}

deleteConfig() {    
if [ -f "pki/reqs/$2.req" ]; then
    rm "$OUTPUT/$2.ovpn" "pki/issued/$2.crt" "pki/private/$2.key" "pki/reqs/$2.req"
    return 0
else 
    return 2
fi;
}

updateConfig() {
    if [ -f "pki/issued/$2.crt" ]; then
        deleteConfig "$1" "$2"
        createConfig "$1" "$2"
        exit 0
    else 
        exit 1
    fi;
}

if [ "$1" = "create" ]; then
    createConfig "$1" "$2"
    exit $?
elif [ "$1" = "delete" ]; then
    deleteConfig "$1" "$2"
    exit $?
else
    echo "method"
    exit 1
fi;
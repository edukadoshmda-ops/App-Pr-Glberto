import sys

with open('compra.html', 'r', encoding='utf-8') as f:
    content = f.read()

target = """if (!signUpError) {
                        document.getElementById('purchaseForm').style.display = 'none';
                        document.getElementById('successMessage').style.display = 'block';
                        return;"""
                        
replacement = """if (!signUpError) {
                        try {
                            const port = window.location.port ? window.location.port : '3000';
                            let apiHost = '';
                            if (port === '3000' || port === '5000') {
                                apiHost = 'http://localhost:5000'; // local server.js
                            }
                            await fetch(`${apiHost}/api/users`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    id: signUpData.user ? signUpData.user.id : null,
                                    fullName: fullName,
                                    email: email,
                                    phone: phone
                                })
                            });
                        } catch(e) {
                            console.error('Error saving user locally:', e);
                        }
                        
                        document.getElementById('purchaseForm').style.display = 'none';
                        document.getElementById('successMessage').style.display = 'block';
                        return;"""

if target in content:
    content = content.replace(target, replacement)
    with open('compra.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced compra.html successfully")
else:
    print("Target not found in compra.html")

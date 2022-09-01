import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'

export const SendSolForm: FC = () => {
    const [txSig, setTxSig] = useState<string>(null)
    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()

    const link = () => {
        return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''
    }

    const sendSol = async (event) => {
        event.preventDefault()
        if (!connection || !publicKey) {
            alert("Connect your wallet")
            return
        }

        let toPubkey
        try {
            toPubkey = new PublicKey(event.target.recipient.value)
        } catch(e) {
            alert('Invalid pubkey')
            console.log(e)
            return
        }

        console.log(`Send ${event.target.amount.value} SOL to ${event.target.recipient.value}`)
        const transaction = new Transaction()

        const instruction = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: toPubkey,
            lamports: event.target.amount.value * LAMPORTS_PER_SOL
        })
        transaction.add(instruction)

        const  signature = await sendTransaction(transaction, connection)
        setTxSig(signature)
    }

    return (
        <div>
            <form onSubmit={sendSol} className={styles.form}>
                <label htmlFor="amount">Amount (in SOL) to send:</label>
                <input id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                <br />
                <label htmlFor="recipient">Send SOL to:</label>
                <input id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                <button type="submit" className={styles.formButton}>Send</button>
            </form>
            {
                txSig ?
                    <div>
                        <p>View your transaction on </p>
                        <a href={link()}>Solana Explorer</a>
                    </div> :
                    null
            }
        </div>
    )
}
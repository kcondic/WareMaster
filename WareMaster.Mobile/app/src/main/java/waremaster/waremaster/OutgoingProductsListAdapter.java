package waremaster.waremaster;

import android.content.Context;
import android.text.InputFilter;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListAdapter;
import android.widget.TextView;
import java.util.ArrayList;
import waremaster.waremaster.MinMaxFilter;
import waremaster.waremaster.R;


public class OutgoingProductsListAdapter extends BaseAdapter implements ListAdapter {
    private ArrayList<String> list = new ArrayList<String>();
    private Context context;

    public OutgoingProductsListAdapter(ArrayList<String> list, Context context) {
        this.list = list;
        this.context = context;
    }

    @Override
    public int getCount() {
        return list.size();
    }

    @Override
    public Object getItem(int pos) {
        return list.get(pos);
    }

    @Override
    public long getItemId(int pos) {
        return 0;
        //just return 0 if your list items do not have an Id variable.
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
        View view = convertView;
        if (view == null) {
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view = inflater.inflate(R.layout.outgoing_orders_product_list_layout, null);
        }

        //Handle TextView and display string from your list
        TextView productName = (TextView)view.findViewById(R.id.productNameView);
        productName.setText(list.get(position));

        EditText numberTaken = (EditText)view.findViewById(R.id.numberOfTakenEditText);
        numberTaken.setText("0");

        return view;
    }
}
